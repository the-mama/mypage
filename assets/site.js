(function () {
  const pageSize = 5;

  function installNavigation() {
    const toggle = document.querySelector(".menu-toggle");
    const close = document.querySelector(".menu-close");
    const backdrop = document.querySelector(".nav-backdrop");
    const drawer = document.querySelector(".nav-drawer");
    if (!toggle || !close || !backdrop || !drawer) return;

    const setOpen = (open, restoreFocus = false) => {
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      drawer.setAttribute("aria-hidden", String(!open));
      if (open) close.focus();
      if (!open && restoreFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => setOpen(true));
    close.addEventListener("click", () => setOpen(false, true));
    backdrop.addEventListener("click", () => setOpen(false, true));
    drawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && document.body.classList.contains("nav-open")) {
        setOpen(false, true);
      }
    });
  }

  function parseFrontmatter(markdown) {
    if (!markdown.startsWith("---")) return { data: {}, content: markdown };
    const end = markdown.indexOf("\n---", 3);
    if (end === -1) return { data: {}, content: markdown };

    const data = {};
    markdown
      .slice(3, end)
      .split("\n")
      .forEach((line) => {
        const separator = line.indexOf(":");
        if (separator === -1) return;
        const key = line.slice(0, separator).trim();
        const value = line.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
        data[key] = value;
      });

    return { data, content: markdown.slice(end + 4).trim() };
  }

  function formatDate(value) {
    if (!value) return "";
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  async function readMarkdown(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    return response.text();
  }

  async function loadManifest(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Unable to load ${path}`);
    return response.json();
  }

  function tagsFor(post) {
    if (!post.tags) return [];
    return String(post.tags)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  function openBlog(post) {
    const modal = document.getElementById("blogModal");
    const content = document.getElementById("blogContent");
    if (!modal || !content) return;

    const renderer = window.marked ? window.marked.parse(post.content) : `<pre>${escapeHtml(post.content)}</pre>`;
    content.innerHTML = `
      <div class="post-date">${escapeHtml(formatDate(post.date))}</div>
      ${renderer}
      <button class="blog-close" type="button">Back to posts</button>
    `;
    modal.classList.add("active");
    content.querySelector(".blog-close").addEventListener("click", closeBlog);
  }

  async function openPostPath(path) {
    const markdown = await readMarkdown(path);
    const parsed = parseFrontmatter(markdown);
    openBlog({ path, content: parsed.content, ...parsed.data });
  }

  function closeBlog() {
    const modal = document.getElementById("blogModal");
    if (modal) modal.classList.remove("active");
  }

  async function installBlogList(section) {
    const targetId = section.dataset.blogTarget;
    const manifestPath = section.dataset.blogManifest;
    const grid = document.getElementById(targetId);
    const search = document.querySelector(`[data-blog-search="${targetId}"]`);
    if (!targetId || !manifestPath || !grid) return;

    try {
      const manifest = await loadManifest(manifestPath);
      const posts = await Promise.all(
        manifest.posts.map(async (path) => {
          const markdown = await readMarkdown(path);
          const parsed = parseFrontmatter(markdown);
          return { path, content: parsed.content, ...parsed.data };
        })
      );

      let currentPage = 1;
      posts.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
      grid.classList.add("post-list");

      function matchingPosts() {
        const query = search ? search.value.trim().toLocaleLowerCase() : "";
        if (!query) return posts;
        return posts.filter((post) => {
          const searchable = [
            post.title,
            post.excerpt,
            post.category,
            post.tags,
            post.author,
            post.content
          ]
            .join(" ")
            .toLocaleLowerCase();
          return searchable.includes(query);
        });
      }

      function renderPage() {
        const filteredPosts = matchingPosts();
        const totalPages = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
        currentPage = Math.min(currentPage, totalPages);
        const start = (currentPage - 1) * pageSize;
        const pagePosts = filteredPosts.slice(start, start + pageSize);
        section.querySelector(".pagination")?.remove();

        if (!pagePosts.length) {
          grid.innerHTML = `<p class="post-list-empty">No posts match that search.</p>`;
          return;
        }

        grid.innerHTML = pagePosts
          .map((post, index) => {
            const tags = tagsFor(post);
            const tagHtml = tags
              .slice(0, 3)
              .map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`)
              .join("");
            return `
            <button class="post-row" type="button" data-post-path="${escapeHtml(post.path)}">
              <time class="post-date" datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>
              <span>
                <span class="blog-category">${escapeHtml(post.category || manifest.category || "Blog")}</span>
                <span class="post-title">${escapeHtml(post.title || "Untitled")}</span>
                <span class="post-excerpt">${escapeHtml(post.excerpt || "")}</span>
                <span class="post-meta">
                  ${tagHtml || `<span class="post-tag">${escapeHtml(post.author || "The Mahesh")}</span>`}
                </span>
              </span>
            </button>
          `;
          })
          .join("");

        if (totalPages > 1) {
          const pagination = document.createElement("div");
          pagination.className = "pagination";
          pagination.innerHTML = Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return `<button type="button" data-page="${page}" aria-current="${page === currentPage ? "page" : "false"}">${page}</button>`;
          }).join("");
          grid.after(pagination);
        }
      }

      grid.addEventListener("click", (event) => {
        const row = event.target.closest("[data-post-path]");
        if (row) {
          event.preventDefault();
          const post = posts.find((entry) => entry.path === row.dataset.postPath);
          if (post) openBlog(post);
        }
      });

      section.addEventListener("click", (event) => {
        const button = event.target.closest("[data-page]");
        if (!button) return;
        currentPage = Number(button.dataset.page);
        renderPage();
      });

      if (search) {
        search.addEventListener("input", () => {
          currentPage = 1;
          renderPage();
        });
      }

      renderPage();
    } catch (error) {
      if (!grid.querySelector(".post-row")) {
        grid.innerHTML = `<p class="post-list-empty">Posts could not be loaded. Refresh the page or try again shortly.</p>`;
      }
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    installNavigation();
    document.querySelectorAll("[data-blog-manifest]").forEach(installBlogList);

    const postPath = new URLSearchParams(window.location.search).get("post");
    if (postPath) {
      openPostPath(postPath).catch((error) => console.error(error));
    }

    const modal = document.getElementById("blogModal");
    if (modal) {
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeBlog();
      });
    }
  });
})();
