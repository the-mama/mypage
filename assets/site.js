(function () {
  const pageSize = 5;

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
      const totalPages = Math.max(1, Math.ceil(posts.length / pageSize));
      posts.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
      grid.classList.add("post-list");

      function renderPage() {
        const start = (currentPage - 1) * pageSize;
        const pagePosts = posts.slice(start, start + pageSize);
        grid.innerHTML = pagePosts
          .map((post, index) => {
            const tags = tagsFor(post);
            const tagHtml = tags
              .slice(0, 3)
              .map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`)
              .join("");
            return `
            <button class="post-row" type="button" data-post-index="${index}">
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
        const row = event.target.closest("[data-post-index]");
        if (row) {
          event.preventDefault();
          const postIndex = (currentPage - 1) * pageSize + Number(row.dataset.postIndex);
          openBlog(posts[postIndex]);
        }
      });

      section.addEventListener("click", (event) => {
        const button = event.target.closest("[data-page]");
        if (!button) return;
        currentPage = Number(button.dataset.page);
        section.querySelector(".pagination")?.remove();
        renderPage();
      });

      renderPage();
    } catch (error) {
      if (!grid.children.length) {
        grid.innerHTML = `<p class="post-list-empty">Posts are available after the site finishes deploying.</p>`;
      }
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
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
