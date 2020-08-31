import {LitElement, TemplateResult, customElement, css, html, property} from 'lit-element';
import {
  contactMe,
  continuous,
  dev,
  github,
  linkedin,
  podcast,
  ruler,
  testing,
  training,
  twitter,
  youtube,
} from '../../theme/icons';
import BreakpointService, {Breakpoint} from '../../services/Breakpoint';
import {card, reset, tiles} from '../../theme/shared-styles';
import '../../elements/am-card';
import '../../elements/am-flyout';
import '../../elements/am-flyout/am-flyout-icon';
import '../../elements/am-item-scroller';

import '@material/mwc-icon';

const slimBreakpoints = [Breakpoint.XSmall, Breakpoint.Small];

export class Card {
  classes?: string;
  description: TemplateResult;
  icon?: TemplateResult;
  links?: TemplateResult;
  title: string;
}

/**
 * `am-page-main` the home page containing information about me, services I provide, my projects, and contact info.
 */
@customElement('am-page-main')
export class AmPageMain extends LitElement {
  static styles = [
    reset,
    card,
    tiles,
    css`
      :host {
        padding-bottom: var(--gutter);
        display: relative;
        font-size: 16pt;
      }
      am-flyout ~ .card {
        padding-left: calc(var(--padding) * 2 + 36px);
      }
      .inline-emphasis {
        margin: 0;
        padding: 0;
        font-size: 16pt;
        font-weight: bold;
      }
      .primary-content .inline-emphasis {
        font-size: 17pt;
      }

      #projects {
        overflow: hidden;
      }
      .primary-content {
        font-size: 16pt;
      }

      .project-card {
        height: 90%;
        width: calc(100% - var(--gutter) - var(--padding) * 2);
        max-width: 400px;
        background-color: var(--primary-background-color);
        box-shadow: 0 0 4px 0 var(--shadow-color, var(--divider-shadow-color));
        border-radius: 8px;
        border: 1px solid var(--divider-shadow-color);
      }
      [mobile] .project-card {
        max-width: 320px;
      }
      .project-link {
        display: inline-block;
        padding: 0 5px;
      }
      .project-link > mwc-icon {
        height: 40px;
        width: 40px;
      }
      am-item-scroller[mobile] {
        height: 425px;
      }
      am-item-scroller:not([mobile]) {
        height: 320px;
      }

      .divider {
        border-bottom: 1px solid var(--divider-color);
      }
    `,
  ];

  private breakpointObserver: () => void;

  @property({type: Array}) private flyouts = [
    {
      href: 'mailto:austin.d.murdock@gmail.com',
      icon: 'email',
      text: 'austin.d.murdock@gmail.com',
    },
    {
      href: 'tel:+16365773448',
      icon: 'phone',
      text: '(636) 577-3448',
    },
    {
      href: 'https://twitter.com/admwx7',
      icon: twitter(),
      text: '@admwx7',
    },
    {
      href: 'https://www.linkedin.com/in/austinmurdock/',
      icon: linkedin(),
      text: 'austinmurdock',
    },
    {
      href: 'https://www.youtube.com/user/admwx7',
      icon: youtube(),
      text: 'admwx7',
    },
    {
      href: 'https://github.com/admwx7',
      icon: github(),
      text: 'admwx7',
    },
  ];
  @property({type: Array}) private projects: Card[] = [
    {
      classes: 'project-card',
      title: 'Portfolio',
      description: html`
        This very website! It's a location to house information about myself, my career, and a few of the projects
        that I've worked on. I'm also building out a <a href="/blog">blog page</a> to support the effort I started
        on my <a href="https://www.youtube.com/user/admwx7">YouTube channel</a> distributing information on how to
        tackle common <a href="https://www.polymer-project.org/">Polymer</a> related issues.
      `,
      links: html`
        <a href="https://github.com/admwx7/portfolio" alt="Source Code" class="project-link">
          <am-flyout-icon>${github()}</am-flyout-icon>
        </a>
      `,
    },
    {
      classes: 'project-card',
      title: 'Initiate Today',
      description: html`
        The first <a href="https://northamerica.startupbus.com/2017/">StartupBus</a> out
        of St. Louis, during this week long competition our team of 3 put together <a href="https://initiate.today">
        initiate.today</a> to solve the gap in time between accepting a job and starting at a company
        (pre-boarding).
      `,
      links: html`
        <a href="https://youtu.be/zKeyVhC8qbU?t=2h37m14s" alt="Final Pitch" class="project-link">
          <am-flyout-icon>${youtube()}</am-flyout-icon>
        </a>
        <a href="http://bit.ly/2AV2M0O" alt="Entrepreneurially Thinking Podcast" class="project-link">
          <am-flyout-icon>${podcast()}</am-flyout-icon>
        </a>
      `,
    },
    {
      classes: 'project-card',
      title: 'GlobalHack VI',
      description: html`
        Teams were tasked with creating software to help groups like the St. Patrick Center &quot;do more with
        less&quot; when helping the homeless. Over the 39hr coding session my team and I put together a
        <a href="https://global-hack-6.firebaseapp.com/">Homeless Management System</a> with a call-in service to
        help tracking, intake, and locating facilities.
      `,
      links: html`
        <a href="https://github.com/Hackception/global-hack-6" alt="Source Code" class="project-link">
          <am-flyout-icon>${github()}</am-flyout-icon>
        </a>
      `,
    },
    {
      classes: 'project-card',
      title: 'GlobalHack V',
      description: html`
        This first civic based GlobalHack, aimed at the justice system and helping better provide information to the
        public. The app is mobile friendly, printer friendly, has offline support for recovering data from previous
        searches. Meanjs was used for scaffolding with a free Bootstrap 3 theme.
      `,
      links: html`
        <a href="https://github.com/Hackception/civiception" alt="Source Code" class="project-link">
          <am-flyout-icon>${github()}</am-flyout-icon>
        </a>
      `,
    },
    {
      classes: 'project-card',
      title: 'GlobalHack IV',
      description: html`
        The goal was to create a new widget utilizing the LockerDome API, we created an interactive chart that would
        allow a user to draw a line, compare it to the true line then view what other users entered. A submission
        form was created using AngularJS, the chart was created using the C3 charting library.
      `,
      links: html`
        <a href="https://github.com/Hackception/Widgetception" alt="Source Code" class="project-link">
          <am-flyout-icon>${github()}</am-flyout-icon>
        </a>
      `,
    },
  ];
  @property({type: Array}) private services: Card[] = [
    {
      icon: ruler(),
      title: 'Architecture',
      description: html`
        Architecting Web Apps and elements for scalability and re-use is what I love, it's also what I'm great at.
        Breaking down complex systems into components to isolate re-usable code and designing for scaling and growth
        is what drew me to Software in the first place.
      `,
    },
    {
      icon: dev(),
      title: 'Development',
      description: html`
        There's little I enjoy more than putting code to an idea or concept I've been working on, but you can't just
        skip past all of the foundational work and jump straight to the fun part. Which is why I focus on code
        quality, re-usability, and readability to prevent rebuilding the same foundational parts over and over again.
      `,
    },
    {
      icon: testing(),
      title: 'Testing',
      description: html`
        Code is a living thing that evolves and grows over time, unit testing provides a sustainable way to ensure
        the code I write continues to function as intended long after it has been modified beyond it's intended
        purpose.
      `,
    },
    {
      icon: continuous(),
      title: 'DevOps',
      description: html`
        There's no point in building software if no one can access it, whether it's running scripts to build and
        deploy an application or run unit tests against a new open sourc element I've created continuous integration
        and deployment play an integral role in modern development.
      `,
    },
    {
      icon: training(),
      title: 'Training',
      description: html`
        Have some new devs that you want brought up to speed on HTML/CSS/JS? Or maybe need a crash course in the new
        web-components standards and how they are changing the way we build Front-End assets? I can work with you to
        put together a training course that fits your exact needs.
      `,
    },
  ];
  @property({type: Boolean}) private slim = false;

  connectedCallback() {
    super.connectedCallback();

    this.breakpointObserver =
      BreakpointService.onBreakpointChanged((breakpoint) => this.slim = slimBreakpoints.includes(breakpoint));
  }
  disconnectedCallback() {
    super.disconnectedCallback();

    this.breakpointObserver();
  }
  render(): TemplateResult {
    const {flyouts, projects, renderCard, services, slim} = this;

    return html`
      <am-flyout ?inline=${slim} .items=${flyouts}>${contactMe()}</am-flyout>
      <div id="intro" class="card">
        <p class="primary-content card__content">
          I am a <span class="inline-emphasis">Front-End</span> focused <span class="inline-emphasis">Full-Stack
          Engineer</span> with an emphasis on <span class="inline-emphasis">Architecture</span> and developing intuitive
          <span class="inline-emphasis">User Experiences</span>. I firmly believe in the benefit of
          <span class="inline-emphasis"> Unit Testing</span> and rely heavily on <span class="inline-emphasis">
          Continuous Integration</span> and <span class="inline-emphasis">Deployment</span> to support my efforts
          building highly <span class="inline-emphasis"> Reusable Elements</span>.
        </p>
      </div>
      <div id="projects" class="card">
        <am-item-scroller .count=${projects.length} ?mobile=${slim}>
          ${projects.map(renderCard)}
        </am-item-scroller>
      </div>
      <div class="card tiles">${services.map(renderCard)}</div>
    `;
  }
  renderCard({classes, description, icon, links, title}: Card): TemplateResult {
    return html`
      <am-card class="${classes}">
        ${ icon ? html`<mwc-icon slot="icon">${icon}</mwc-icon>` : null}
        ${ title ? html`<h3 slot="title">${title}</h3>` : null}
        ${ description ? html`<p slot="description">${description}</p>` : null}
        ${ links ? html`<div slot="links">${links}</div>` : null}
      </am-card>
    `;
  }
}
