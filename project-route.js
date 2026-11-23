const projectRoute = document.currentScript?.dataset.project;
if (projectRoute) location.replace(`projects.html?project=${encodeURIComponent(projectRoute)}`);
