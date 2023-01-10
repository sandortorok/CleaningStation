import { Component, OnInit } from "@angular/core";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  isCollapsed?: boolean,
  children?: RouteInfo[];
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Grafikonok",
    icon: "icon-chart-pie-36",
    class: "",
    children: [
      {
        path: '/current',
        title: "Hőmérséklet",
        icon: "",
        class: ""
      },
      {
        path: '/voltage',
        title: "Nyomások (Ki-/Bemenő)",
        icon: "",
        class: ""
      }
    ]
  },
  {
    path: "/icons",
    title: "Icons",
    icon: "icon-atom",
    class: ""
  },
  {
    path: "/switches",
    title: "Nyomás",
    icon: "icon-triangle-right-17",
    class: ""
  },
  // {
  //   path: "/notifications",
  //   title: "Értesítések",
  //   icon: "icon-bell-55",
  //   class: ""
  // },

  {
    path: "/errors",
    title: "Hibaüzenetek",
    icon: "icon-simple-remove",
    class: ""
  },
  {
    path: "/fchanger",
    title: "Frekvenciaváltó",
    icon: "icon-sound-wave",
    class: ""
  }
  // {
  //   path: "/typography",
  //   title: "Typography",
  //   icon: "icon-align-center",
  //   class: ""
  // }
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
