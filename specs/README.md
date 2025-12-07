# 📋 OrivusJS Module Specifications

This directory contains Example Specifications ("Specs") that you can use to generate full-stack modules with OrivusJS.

## 📂 Example Kits

We have organized examples into "Kits" to help you understand different architectural patterns.

### 🚀 Starter Kit
Simple, single-file modules to get you started.
- **`examples/starter-blog.json`**: A simple blog post module with `title`, `content`, and `published` status.

### 🏢 SaaS Kit (E-Learning Platform)
A modular architecture demonstrating how to build a SaaS application with relationships.
- **`examples/saas-1-user.json`**: User management module.
- **`examples/saas-2-course.json`**: Course management (related to Users).
- **`examples/saas-3-enrollment.json`**: Enrollment system connecting Users and Courses. Uses `skipUI: true` (backend-only).

### 💼 App Kit (Project Manager)
An advanced example demonstrating complex relationships (One-to-Many, Many-to-Many) and modular construction.
- **`examples/pm-1-project.json`**: Core Project entity.
- **`examples/pm-2-task.json`**: Tasks belonging to Projects (1:N).
- **`examples/pm-3-tag.json`**: Global Tags entity.
- **`examples/pm-4-project-tags.json`**: Junction table for Projects and Tags (N:N). Uses `skipUI: true`.

## 🛠️ How to Use

Run the following command to generate any of these modules:

```bash
npm run orivus:create specs/examples/<filename>.json
```

For example:
```bash
npm run orivus:create specs/examples/starter-blog.json
```
