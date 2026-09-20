---
title: My New Blog
date: 2026-08-31
category: Personal
tags: Life, Learning
author: The Mahesh
excerpt: Short summary
---

# My New Blog

I’ll inspect the existing personal-blog template, manifest, and loading code so I can give you the exact repeatable steps for this repository, including file locations and the fields that must match.

Read 

Read 

Read 

Read , lines 1 to 240

To create a new personal blog post, edit only these locations:

**1. Create the post file**

Copy `TEMPLATE.md` and create a new Markdown file inside `blogs`.

Use a URL-friendly filename, for example:

```text
personal/blogs/my-first-personal-story.md
```

At the top, update the frontmatter:

```yaml
---
title: "My First Personal Story"
date: "2026-09-20"
category: "Personal"
author: "Mahesh"
excerpt: "A short description shown in the blog list."
---
```

Then write the article below the second `---`:

```markdown
# My First Personal Story

Your article content goes here.

## A Section Heading

More writing...
```

**2. Add the post to the manifest**

Edit `manifest.json` and add the new path inside `"posts"`:

```json
{
  "category": "Personal",
  "posts": [
    "personal/blogs/my-first-personal-story.md",
    "personal/blogs/movies-i-have-watched.md"
  ]
}
```

The website sorts posts by `date`, so newer dates appear first.

**3. Add images, if needed**

Place images in `images`, then reference them in the Markdown:

```markdown
![Description of image](personal/blogs/images/my-image.jpg)
```

**4. Preview and publish**

Run a local server from the repository folder:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/personal.html
```

Then publish:

```bash
git add personal/blogs
git commit -m "Add personal blog post"
git push origin main
```

You do **not** need to edit `index.html`, `personal.html`, `site.js`, or `site.css` for each new post.