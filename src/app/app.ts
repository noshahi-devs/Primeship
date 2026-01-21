import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Prime Ship';
  sidebarCollapsed = false;

  ngOnInit() {
    // Initialize sidebar state
  }

  ngAfterViewInit() {
    // Add event listener for sidebar toggle
    this.initializeSidebarToggle();
  }

  initializeSidebarToggle() {
    const sidebarToggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');

    if (sidebarToggleBtn && sidebar && mainContent) {
      sidebarToggleBtn.addEventListener('click', () => {
        this.toggleSidebar(sidebar as HTMLElement, mainContent as HTMLElement, sidebarToggleBtn as HTMLElement);
      });
    }

    if (userMenuBtn && userDropdown) {
      userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleUserDropdown(userDropdown);
      });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (userDropdown && !userDropdown.contains(e.target as Node) && userMenuBtn && !userMenuBtn.contains(e.target as Node)) {
        this.closeUserDropdown(userDropdown);
      }
    });
  }

  toggleSidebar(sidebar: HTMLElement, mainContent: HTMLElement, toggleBtn: HTMLElement) {
    const toggleIcon = toggleBtn.querySelector('.toggle-icon');

    this.sidebarCollapsed = !this.sidebarCollapsed;

    if (this.sidebarCollapsed) {
      sidebar.classList.add('collapsed');
      mainContent.classList.add('sidebar-collapsed');
      if (toggleIcon) {
        toggleIcon.textContent = '';
      }
    } else {
      sidebar.classList.remove('collapsed');
      mainContent.classList.remove('sidebar-collapsed');
      if (toggleIcon) {
        toggleIcon.textContent = '';
      }
    }
  }

  toggleUserDropdown(userDropdown: HTMLElement) {
    userDropdown.classList.toggle('show');
  }

  closeUserDropdown(userDropdown: HTMLElement) {
    userDropdown.classList.remove('show');
  }
}
