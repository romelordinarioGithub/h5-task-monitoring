const dashboardData = {
  teams: [
    { name: "h5 team", short: "H5" },
    { name: "Design team", short: "DS" },
    { name: "video dev team", short: "VD" },
    { name: "QA team", short: "QA" },
  ],
  taskTypes: [
    { name: "Concept build", count: 14 },
    { name: "Studio Setup", count: 9 },
    { name: "Migration", count: 6 },
    { name: "Build Consultation", count: 11 },
    { name: "Exports", count: 8 },
    { name: "Others (h5)", count: 5 },
  ],
  devResources: {
    totalHeadcount: 21,
    available: [
      {
        name: "Mika Santos",
        team: "h5 team",
        capacity: "Available for 2 tasks",
        skill: "Rich media builds",
        availability: "Free after current Google Display handoff today.",
        status: "Available",
      },
      {
        name: "Paolo Reyes",
        team: "video dev team",
        capacity: "Available for 1 task",
        skill: "Video packaging",
        availability: "Can pick up a new task tomorrow morning.",
        status: "Partially Available",
      },
      {
        name: "Aira Mendoza",
        team: "Design team",
        capacity: "Available for consultation",
        skill: "Creative setup support",
        availability: "Open for build consultation and setup reviews.",
        status: "Available",
      },
      {
        name: "Ken Dela Cruz",
        team: "QA team",
        capacity: "Available for testing queue",
        skill: "QA validation",
        availability: "Ready to support tasks entering testing this afternoon.",
        status: "Available",
      },
    ],
  },
  ticketClosedCount: 37,
  recentActivities: [
    {
      task: "Concept build - Lorem ipsum dolor blah blah campaign kickoff build",
      fromStatus: "In Progress",
      toStatus: "Testing",
      actor: "Mika Santos",
      time: "5 mins ago",
    },
    {
      task: "Studio Setup - Lorem ipsum dolor blah blah creative package setup",
      fromStatus: "Awaiting Feedback",
      toStatus: "In Progress",
      actor: "Paolo Reyes",
      time: "18 mins ago",
    },
    {
      task: "Migration - Lorem ipsum dolor blah blah legacy unit migration",
      fromStatus: "Testing",
      toStatus: "Completed",
      actor: "Ken Dela Cruz",
      time: "34 mins ago",
    },
    {
      task: "Others - Lorem ipsum dolor blah blah special h5 support request",
      fromStatus: "On Hold",
      toStatus: "In Progress",
      actor: "Lea Navarro",
      time: "52 mins ago",
    },
    {
      task: "Exports - Lorem ipsum dolor blah blah reporting asset export",
      fromStatus: "In Progress",
      toStatus: "Completed",
      actor: "Noel Garcia",
      time: "1 hour ago",
    },
    {
      task: "Build Consultation - Lorem ipsum dolor blah blah handoff review",
      fromStatus: "Not Started",
      toStatus: "In Progress",
      actor: "Aira Mendoza",
      time: "1 hour ago",
    },
    {
      task: "Studio Setup - Lorem ipsum dolor blah blah dynamic text rule setup",
      fromStatus: "In Progress",
      toStatus: "Awaiting Feedback",
      actor: "Mark Evangelista",
      time: "2 hours ago",
    },
  ],
  tasks: [
    {
      name: "Concept build - Lorem ipsum dolor blah blah campaign kickoff build",
      type: "Concept build",
      channel: "Google Display",
      health: "Healthy",
      status: "In Progress",
      priority: "High",
      assignee: "Mika Santos",
    },
    {
      name: "Studio Setup - Lorem ipsum dolor blah blah creative package setup",
      type: "Studio Setup",
      channel: "Meta Static",
      health: "Watch",
      status: "Awaiting Feedback",
      priority: "Normal",
      assignee: "Paolo Reyes",
    },
    {
      name: "Others - Lorem ipsum dolor blah blah special h5 support request",
      type: "Others (h5)",
      channel: "Google Display",
      health: "Risk",
      status: "On Hold",
      priority: "Urgent",
      assignee: "Lea Navarro",
    },
    {
      name: "Migration - Lorem ipsum dolor blah blah legacy unit migration",
      type: "Migration",
      channel: "Meta Static",
      health: "Critical",
      status: "Testing",
      priority: "High",
      assignee: "Ken Dela Cruz",
    },
    {
      name: "Build Consultation - Lorem ipsum dolor blah blah handoff review",
      type: "Build Consultation",
      channel: "Google Display",
      health: "Watch",
      status: "Not Started",
      priority: "Low",
      assignee: "Aira Mendoza",
    },
    {
      name: "Exports - Lorem ipsum dolor blah blah reporting asset export",
      type: "Exports",
      channel: "Meta Static",
      health: "Healthy",
      status: "Completed",
      priority: "Normal",
      assignee: "Noel Garcia",
    },
    {
      name: "Concept build - Lorem ipsum dolor blah blah launch banner concept pack",
      type: "Concept build",
      channel: "Meta Static",
      health: "Watch",
      status: "Testing",
      priority: "High",
      assignee: "Rica Flores",
    },
    {
      name: "Studio Setup - Lorem ipsum dolor blah blah placement configuration update",
      type: "Studio Setup",
      channel: "Google Display",
      health: "Healthy",
      status: "In Progress",
      priority: "Normal",
      assignee: "Paul Medina",
    },
    {
      name: "Migration - Lorem ipsum dolor blah blah old rich media asset transfer",
      type: "Migration",
      channel: "Meta Static",
      health: "Risk",
      status: "Awaiting Feedback",
      priority: "Urgent",
      assignee: "Jessa Cruz",
    },
    {
      name: "Build Consultation - Lorem ipsum dolor blah blah solution alignment call",
      type: "Build Consultation",
      channel: "Google Display",
      health: "Healthy",
      status: "Not Started",
      priority: "Low",
      assignee: "Theo Ramos",
    },
    {
      name: "Exports - Lorem ipsum dolor blah blah final package output review",
      type: "Exports",
      channel: "Meta Static",
      health: "Watch",
      status: "On Hold",
      priority: "Normal",
      assignee: "Mia Lopez",
    },
    {
      name: "Others - Lorem ipsum dolor blah blah h5 animation fallback request",
      type: "Others (h5)",
      channel: "Google Display",
      health: "Healthy",
      status: "In Progress",
      priority: "High",
      assignee: "Josh Rivera",
    },
    {
      name: "Concept build - Lorem ipsum dolor blah blah retail campaign storyboard",
      type: "Concept build",
      channel: "Google Display",
      health: "Critical",
      status: "Awaiting Feedback",
      priority: "Urgent",
      assignee: "Nica Villanueva",
    },
    {
      name: "Studio Setup - Lorem ipsum dolor blah blah feed-driven unit preparation",
      type: "Studio Setup",
      channel: "Meta Static",
      health: "Watch",
      status: "Testing",
      priority: "High",
      assignee: "Carlo Ong",
    },
    {
      name: "Migration - Lorem ipsum dolor blah blah template rebuild conversion",
      type: "Migration",
      channel: "Google Display",
      health: "Healthy",
      status: "In Progress",
      priority: "Normal",
      assignee: "Nina Bautista",
    },
    {
      name: "Build Consultation - Lorem ipsum dolor blah blah QA handoff checklist",
      type: "Build Consultation",
      channel: "Meta Static",
      health: "Risk",
      status: "On Hold",
      priority: "High",
      assignee: "Ian Torres",
    },
    {
      name: "Exports - Lorem ipsum dolor blah blah multilanguage asset delivery",
      type: "Exports",
      channel: "Google Display",
      health: "Healthy",
      status: "Completed",
      priority: "Low",
      assignee: "Dana Perez",
    },
    {
      name: "Others - Lorem ipsum dolor blah blah h5 bugfix support follow-up",
      type: "Others (h5)",
      channel: "Meta Static",
      health: "Watch",
      status: "In Progress",
      priority: "Normal",
      assignee: "Lui Castillo",
    },
    {
      name: "Concept build - Lorem ipsum dolor blah blah automotive resize package",
      type: "Concept build",
      channel: "Meta Static",
      health: "Healthy",
      status: "Not Started",
      priority: "Normal",
      assignee: "Bea Santiago",
    },
    {
      name: "Studio Setup - Lorem ipsum dolor blah blah dynamic text rule setup",
      type: "Studio Setup",
      channel: "Google Display",
      health: "Risk",
      status: "Awaiting Feedback",
      priority: "Urgent",
      assignee: "Mark Evangelista",
    },
    {
      name: "Migration - Lorem ipsum dolor blah blah archive-to-live ad conversion",
      type: "Migration",
      channel: "Meta Static",
      health: "Critical",
      status: "In Progress",
      priority: "Urgent",
      assignee: "Trish Gomez",
    },
    {
      name: "Build Consultation - Lorem ipsum dolor blah blah pre-build advisory session",
      type: "Build Consultation",
      channel: "Google Display",
      health: "Healthy",
      status: "Completed",
      priority: "Low",
      assignee: "Arvin Santos",
    },
  ],
};

let selectedTaskIndex = 0;

function renderTeams() {
  document.getElementById("team-list").innerHTML = dashboardData.teams
    .map(
      (team, index) => `
        <article class="team-item fade-in" style="animation-delay: ${index * 50}ms">
          <div class="team-item__icon">${team.short}</div>
          <p class="team-item__name">${team.name}</p>
        </article>
      `,
    )
    .join("");
}

function renderTaskTypes() {
  const totalTaskTypes = dashboardData.taskTypes.reduce((sum, item) => sum + item.count, 0);
  const cardTones = ["violet", "blue", "cyan", "pink", "indigo", "purple"];
  const iconMap = {
    "Concept build": `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3.5l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"></path>
      </svg>
    `,
    "Studio Setup": `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6.5h16v11H4z"></path>
        <path d="M8 4h8v3H8z"></path>
      </svg>
    `,
    Migration: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 7h8l-2.5-2.5L12 3l5 5-5 5-1.5-1.5L13 9H5z"></path>
        <path d="M19 17h-8l2.5 2.5L12 21l-5-5 5-5 1.5 1.5L11 15h8z"></path>
      </svg>
    `,
    "Build Consultation": `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 5h16v10H8l-4 4z"></path>
      </svg>
    `,
    Exports: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4l4 4h-3v6h-2V8H8z"></path>
        <path d="M5 15h14v5H5z"></path>
      </svg>
    `,
    "Others (h5)": `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 5h10v4H7z"></path>
        <path d="M5 11h14v8H5z"></path>
      </svg>
    `,
  };

  document.getElementById("task-type-grid").innerHTML = dashboardData.taskTypes
    .map(
      (taskType, index) => {
        const percent = totalTaskTypes ? Math.round((taskType.count / totalTaskTypes) * 100) : 0;
        const tone = cardTones[index % cardTones.length];
        const icon = iconMap[taskType.name] || iconMap["Others (h5)"];
        return `
        <article class="task-type-card task-type-card--${tone} fade-in" style="animation-delay: ${index * 60}ms">
          <div class="task-type-card__top">
            <p class="task-type-card__label">${taskType.name}</p>
            <div class="task-type-card__icon" aria-hidden="true">${icon}</div>
          </div>
          <div class="task-type-card__body">
            <h3 class="task-type-card__count">${taskType.count}</h3>
            <p class="task-type-card__city">${taskType.name}</p>
          </div>
          <p class="task-type-card__foot">${percent}% of current task load</p>
        </article>
      `;
      },
    )
    .join("");
}

function toBadgeClass(value) {
  return value.toLowerCase().replaceAll(" ", "-").replaceAll("(", "").replaceAll(")", "");
}

function renderTaskTable() {
  document.getElementById("queue-count").textContent = `${dashboardData.tasks.length} tasks`;
  document.getElementById("task-table-body").innerHTML = dashboardData.tasks
    .map(
      (task, index) => `
        <article
          class="task-row fade-in ${index === selectedTaskIndex ? "task-row--active" : ""}"
          style="animation-delay: ${index * 24}ms"
          data-task-index="${index}"
        >
          <p class="task-row__title">${task.name}</p>
          <div class="task-row__text">${task.type}</div>
          <div class="task-row__text">${task.channel}</div>
          <div><span class="task-badge badge-health-${toBadgeClass(task.health)}">${task.health}</span></div>
          <div><span class="task-badge badge-status-${toBadgeClass(task.status)}">${task.status}</span></div>
          <div><span class="task-badge badge-priority-${toBadgeClass(task.priority)}">${task.priority}</span></div>
          <div class="task-row__text">${task.assignee}</div>
        </article>
      `,
    )
    .join("");
}

function renderTaskDetail() {
  const task = dashboardData.tasks[selectedTaskIndex];
  document.getElementById("task-detail-card").innerHTML = `
    <article class="task-detail-card__hero fade-in">
      <p class="task-detail-card__eyebrow">${task.type}</p>
      <h3 class="task-detail-card__title">${task.name}</h3>
      <p class="task-detail-card__subtext">
        Frontend placeholder detail view for the selected task. This can later hold deadlines, blockers,
        attachments, owner notes, and delivery updates.
      </p>
      <div class="task-detail-card__pill-row">
        <span class="task-badge badge-health-${toBadgeClass(task.health)}">${task.health}</span>
        <span class="task-badge badge-status-${toBadgeClass(task.status)}">${task.status}</span>
        <span class="task-badge badge-priority-${toBadgeClass(task.priority)}">${task.priority}</span>
      </div>
    </article>
    <article class="task-detail-card__grid fade-in">
      <div>
        <p class="task-detail-card__label">Channel</p>
        <p class="task-detail-card__value">${task.channel}</p>
      </div>
      <div>
        <p class="task-detail-card__label">Assigned Dev</p>
        <p class="task-detail-card__value">${task.assignee}</p>
      </div>
      <div>
        <p class="task-detail-card__label">Task Type</p>
        <p class="task-detail-card__value">${task.type}</p>
      </div>
      <div>
        <p class="task-detail-card__label">Priority</p>
        <p class="task-detail-card__value">${task.priority}</p>
      </div>
      <div>
        <p class="task-detail-card__label">Current Status</p>
        <p class="task-detail-card__value">${task.status}</p>
      </div>
      <div>
        <p class="task-detail-card__label">Health</p>
        <p class="task-detail-card__value">${task.health}</p>
      </div>
    </article>
  `;
}

function renderDevResources() {
  document.getElementById("resource-headcount").textContent = String(
    dashboardData.devResources.totalHeadcount,
  );
  document.getElementById("resource-available-count").textContent = String(
    dashboardData.devResources.available.length,
  );

  document.getElementById("resource-grid").innerHTML = dashboardData.devResources.available
    .map(
      (resource, index) => `
        <article class="resource-card fade-in" style="animation-delay: ${index * 50}ms">
          <div class="resource-card__top">
            <div>
              <h3 class="resource-card__name">${resource.name}</h3>
              <p class="resource-card__team">${resource.team}</p>
            </div>
            <span class="task-badge badge-health-${resource.status === "Available" ? "healthy" : "watch"}">${resource.status}</span>
          </div>
          <div class="resource-card__meta">
            <span class="task-badge badge-priority-normal">${resource.capacity}</span>
            <span class="task-badge badge-status-in-progress">${resource.skill}</span>
          </div>
          <p class="resource-card__availability">${resource.availability}</p>
        </article>
      `,
    )
    .join("");
}

function renderTicketClosed() {
  const closedCount = dashboardData.ticketClosedCount;
  const totalTasks = dashboardData.tasks.length;
  const closedRate = totalTasks ? Math.round((closedCount / totalTasks) * 100) : 0;

  document.getElementById("closed-ticket-count").textContent = String(closedCount);
  document.getElementById("closed-ticket-text").textContent =
    `${closedCount} tickets have been closed in this dashboard view, keeping throughput ahead of the current open queue.`;
  document.getElementById("closed-ticket-gauge-fill").style.strokeDasharray = `${Math.min(closedRate, 100)} 100`;
}

function renderRecentActivity() {
  document.getElementById("activity-feed").innerHTML = dashboardData.recentActivities
    .map(
      (activity, index) => `
        <article class="activity-item fade-in" style="animation-delay: ${index * 45}ms">
          <div class="activity-item__icon">UPD</div>
          <div>
            <p class="activity-item__title">${activity.task}</p>
            <p class="activity-item__text">
              Status changed from <strong>${activity.fromStatus}</strong> to
              <strong>${activity.toStatus}</strong> by ${activity.actor}.
            </p>
            <div class="activity-item__meta">
              <span class="task-badge badge-status-${toBadgeClass(activity.fromStatus)}">${activity.fromStatus}</span>
              <span class="task-badge badge-status-${toBadgeClass(activity.toStatus)}">${activity.toStatus}</span>
            </div>
          </div>
          <div class="activity-item__time">${activity.time}</div>
        </article>
      `,
    )
    .join("");
}

function wireTaskTable() {
  const rows = Array.from(document.querySelectorAll("[data-task-index]"));
  rows.forEach((row) => {
    row.addEventListener("click", () => {
      selectedTaskIndex = Number(row.getAttribute("data-task-index"));
      renderTaskTable();
      renderTaskDetail();
      wireTaskTable();
    });
  });
}

function wireSidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const toggle = document.getElementById("sidebar-toggle");

  toggle.addEventListener("click", () => {
    const collapsed = sidebar.classList.toggle("sidebar--collapsed");
    toggle.setAttribute("aria-expanded", String(!collapsed));
  });
}

function wireSidebarNav() {
  const links = Array.from(document.querySelectorAll(".sidebar-link"));
  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((item) => item.classList.remove("sidebar-link--active"));
      link.classList.add("sidebar-link--active");
    });
  });
}

function initDashboard() {
  renderTeams();
  renderTaskTypes();
  renderTaskTable();
  renderTaskDetail();
  renderDevResources();
  renderTicketClosed();
  renderRecentActivity();
  wireTaskTable();
  wireSidebarToggle();
  wireSidebarNav();
}

initDashboard();
