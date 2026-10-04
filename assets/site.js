(function () {
  const pageSize = 5;

  function installLiveClock() {
    const clock = document.getElementById("liveClock");
    if (!clock) return;

    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const milliseconds = String(now.getMilliseconds()).padStart(3, "0");
      clock.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
      clock.dateTime = now.toISOString();
    }

    updateClock();
    window.setInterval(updateClock, 31);
  }

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

  function openBlog(post, updateHistory = true) {
    const feed = document.getElementById("blog-feed");
    const article = document.getElementById("blogArticle");
    const heading = document.getElementById("feedHeading");
    if (!feed || !article) return;

    const replacingArticle = !article.hidden;
    const renderer = window.marked ? window.marked.parse(post.content) : `<pre>${escapeHtml(post.content)}</pre>`;
    const image = post.image ? `<img class="article-cover" src="${escapeHtml(post.image)}" alt="" />` : "";
    article.innerHTML = `
      <button class="blog-back" type="button">← All posts</button>
      ${image}
      <header class="article-heading">
        <span class="blog-category">${escapeHtml(post.category || "Personal")}</span>
        <h1>${escapeHtml(post.title || "Untitled")}</h1>
        <p class="article-excerpt">${escapeHtml(post.excerpt || "")}</p>
        <div class="article-meta">${escapeHtml(formatDate(post.date))} · ${escapeHtml(post.author || "The Mahesh")}</div>
      </header>
      <div class="blog-content">${renderer}</div>
    `;
    feed.hidden = true;
    article.hidden = false;
    if (heading) heading.textContent = "Now reading";
    article.querySelector(".blog-back").addEventListener("click", () => closeBlog());
    if (updateHistory) {
      const method = replacingArticle ? "replaceState" : "pushState";
      history[method]({ postPath: post.path }, "", `?post=${encodeURIComponent(post.path)}`);
    }
    article.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function openPostPath(path) {
    const markdown = await readMarkdown(path);
    const parsed = parseFrontmatter(markdown);
    openBlog({ path, content: parsed.content, ...parsed.data }, false);
  }

  function closeBlog(updateHistory = true) {
    const feed = document.getElementById("blog-feed");
    const article = document.getElementById("blogArticle");
    const heading = document.getElementById("feedHeading");
    if (article) article.hidden = true;
    if (feed) feed.hidden = false;
    if (heading) heading.textContent = "Recent posts";
    if (updateHistory && new URLSearchParams(window.location.search).has("post")) {
      history.replaceState({}, "", window.location.pathname);
    }
    if (feed) feed.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function installBlogList(section) {
    const targetId = section.dataset.blogTarget;
    const manifestPath = section.dataset.blogManifest;
    const grid = document.getElementById(targetId);
    const search = document.querySelector(`[data-blog-search="${targetId}"]`);
    if (!targetId || !manifestPath || !grid) return;

    try {
      const manifest = await loadManifest(manifestPath);
      const posts = (await Promise.all(
        manifest.posts.map(async (path) => {
          try {
            const markdown = await readMarkdown(path);
            const parsed = parseFrontmatter(markdown);
            return { path, content: parsed.content, ...parsed.data };
          } catch (error) {
            console.warn(`Skipping blog post ${path}:`, error);
            return null;
          }
        })
      )).filter(Boolean);

      let currentPage = 1;
      posts.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
      grid.classList.add("post-list");

      const calendarMonth = document.getElementById("calendarMonth");
      const calendarGrid = document.getElementById("calendarGrid");
      const calendarClear = document.getElementById("calendarClear");
      let selectedDate = "";
      const today = new Date();
      let calendarDate = new Date(today.getFullYear(), today.getMonth(), 1);

      function renderCalendar() {
        if (!calendarGrid || !calendarMonth) return;
        const year = calendarDate.getFullYear();
        const month = calendarDate.getMonth();
        const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const postDates = new Set(posts.map((post) => post.date).filter(Boolean));
        calendarMonth.textContent = calendarDate.toLocaleDateString("en", { month: "long", year: "numeric" });
        const weekdayLabels = ["M", "T", "W", "T", "F", "S", "S"]
          .map((day) => `<span class="calendar-weekday" aria-hidden="true">${day}</span>`)
          .join("");
        const blanks = Array.from({ length: firstWeekday }, () => `<span class="calendar-blank"></span>`).join("");
        const dayButtons = Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1;
          const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasPost = postDates.has(date);
          return `<button class="calendar-day${hasPost ? " has-post" : ""}" type="button" data-calendar-date="${date}" aria-label="${date}${hasPost ? ", posts published" : ""}" aria-pressed="${selectedDate === date}"${hasPost ? "" : " disabled"}>${day}</button>`;
        }).join("");
        calendarGrid.innerHTML = weekdayLabels + blanks + dayButtons;
        if (calendarClear) calendarClear.hidden = !selectedDate;
      }

      function renderPopularPosts() {
        const popularList = document.getElementById("popularPosts");
        if (!popularList) return;
        const popularPaths = Array.isArray(manifest.popular) ? manifest.popular : [];
        const popularPosts = popularPaths
          .map((path) => posts.find((post) => post.path === path))
          .filter(Boolean)
          .concat(posts.filter((post) => !popularPaths.includes(post.path)))
          .slice(0, 5);
        popularList.innerHTML = popularPosts.map((post, index) => `
          <li>
            <button class="popular-post" type="button" data-post-path="${escapeHtml(post.path)}">
              <span class="popular-index">0${index + 1}</span>
              <span><span class="popular-title">${escapeHtml(post.title || "Untitled")}</span><time>${escapeHtml(formatDate(post.date))}</time></span>
            </button>
          </li>
        `).join("");
      }

      function matchingPosts() {
        const query = search ? search.value.trim().toLocaleLowerCase() : "";
        return posts.filter((post) => {
          if (selectedDate && post.date !== selectedDate) return false;
          if (!query) return true;
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
          grid.innerHTML = `<p class="post-list-empty">${selectedDate ? "No posts were published on this date." : "No posts match that search."}</p>`;
          return;
        }

        grid.innerHTML = pagePosts
          .map((post, index) => {
            const tags = tagsFor(post);
            const fallbackImages = [
              "assets/images/blog-books.jpg",
              "assets/images/blog-movies.jpg",
              "assets/images/blog-meditation.jpg",
              "assets/images/blog-journal.jpg"
            ];
            const image = post.image || fallbackImages[(start + index) % fallbackImages.length];
            const tagHtml = tags
              .slice(0, 3)
              .map((tag) => `<span class="post-tag">${escapeHtml(tag)}</span>`)
              .join("");
            return `
            <button class="post-row" type="button" data-post-path="${escapeHtml(post.path)}">
              <span class="post-row-copy">
                <time class="post-date" datetime="${escapeHtml(post.date)}">${escapeHtml(formatDate(post.date))}</time>
                <span class="blog-category">${escapeHtml(post.category || manifest.category || "Blog")}</span>
                <span class="post-title">${escapeHtml(post.title || "Untitled")}</span>
                <span class="post-excerpt">${escapeHtml(post.excerpt || "")}</span>
                <span class="post-meta">
                  ${tagHtml || `<span class="post-tag">${escapeHtml(post.author || "The Mahesh")}</span>`}
                </span>
              </span>
              <img class="post-thumbnail" src="${escapeHtml(image)}" alt="" loading="lazy" />
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

      document.getElementById("popularPosts")?.addEventListener("click", (event) => {
        const row = event.target.closest("[data-post-path]");
        const post = row && posts.find((entry) => entry.path === row.dataset.postPath);
        if (post) openBlog(post);
      });

      calendarGrid?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-calendar-date]");
        if (!button) return;
        selectedDate = selectedDate === button.dataset.calendarDate ? "" : button.dataset.calendarDate;
        currentPage = 1;
        renderCalendar();
        renderPage();
      });

      document.getElementById("calendarPrev")?.addEventListener("click", () => {
        calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);
        renderCalendar();
      });

      document.getElementById("calendarNext")?.addEventListener("click", () => {
        calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);
        renderCalendar();
      });

      calendarClear?.addEventListener("click", () => {
        selectedDate = "";
        currentPage = 1;
        renderCalendar();
        renderPage();
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

      renderCalendar();
      renderPopularPosts();
      renderPage();
    } catch (error) {
      if (!grid.querySelector(".post-row")) {
        grid.innerHTML = `<p class="post-list-empty">Posts could not be loaded. Refresh the page or try again shortly.</p>`;
      }
      console.error(error);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    installLiveClock();
    installNavigation();
    document.querySelectorAll("[data-blog-manifest]").forEach(installBlogList);

    const postPath = new URLSearchParams(window.location.search).get("post");
    if (postPath) {
      openPostPath(postPath).catch((error) => console.error(error));
    }

    window.addEventListener("popstate", () => {
      const postPath = new URLSearchParams(window.location.search).get("post");
      if (postPath) openPostPath(postPath).catch((error) => console.error(error));
      else closeBlog(false);
    });
  });
})();
