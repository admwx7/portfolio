import { TemplateResult, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import Page from '../../classes/page';
import { card } from '../../theme/shared-styles';
import AuthService from '../../services/Auth';
import BankService from '../../services/Bank';
import RouterService, { RouteName } from '../../services/Router';

import '@material/web/button/filled-button';

/**
 * `am-page-bank-sign-up` the banking sign-up / opt-in page for account creation
 */
@customElement('am-page-bank-sign-up')
export class AmPageBankSignUp extends Page {
  static override styles = [
    ...Page.styles,
    card,
    css`
      .center-content {
        width: 100%;
        display: flex;
        justify-content: center;
        padding: var(--padding);
      }
      #acknowledge {
        font-weight: bold;
        font-size: 18pt;
        height: 56px;
      }
    `,
  ];

  @state() private invite?: string;

  override connectedCallback(): void {
    super.connectedCallback?.();
    const search = window.location.search.replace('?', '');
    const mapping = search.split('&').reduce((acc, i) => {
      const [key, value] = i.split('=');
      if (key) acc[key] = value;
      return acc;
    }, {} as Record<string, string | undefined>);
    this.invite = decodeURIComponent(mapping['invite'] || '') || undefined;
  }

  override render(): TemplateResult {
    const { acknowledgement, invite } = this;

    return html`
      <section class=card ?hidden=${!invite}>
        <h2>You've Been Invited!</h2>
        <p>
          You've been invited to the ${invite} community, read through the information below and
          acknowledge to start trading!
        </p>
      </section>
      <section class=card>
        <h2>Community Banking Sign Up</h2>
        <p>
          Welcome! The goal here is to create a community driven banking system that exists both inside and outside of
          Minecraft. The community system is driven by a moderator that can create / distribute funds which can then be
          traded betweeen community members. A member can be part of multiple communities which have their own currency
          systems.
        </p>
        <p>
          The currency system is not dependant on Minecraft so you can utilize the system without having the game,
          though any sort of transactions would need to be managed directly through the web portal in that case. In
          order for the system to work, a community needs to be configured and bound to an account whether that is
          via a gmail account in the web portal or a Minecraft account in-game. At the minimum the moderator of the
          community <i>must</i> create an account and bind their gmail to it with this web application.
        </p>
      </section>
      <section class=card>
        <h3>Disclaimer</h3>
        <p>
          In order to create an account you will need to sign in with your gmail, meaning I will have the ability to see
          certain details about you that Google provides such as your email, your name, and your profile picture.
          Additionally, if you choose to link your Minecraft account you will be sharing details about your Microsoft
          account and the relationship between the two accounts.
        </p>
        <p>
          I will not share any information provided by you, or stored by you into the system, without first notifying
          you. Though this information is necessary for the system to work to some extent and will be utilized where
          necessary. The system will hide as much information as possible when performing actions such as sending /
          receiving funds within a community, however it is necessary to make certain details available to other
          members within your community to ensure transactions are being sent to the correct parties.
        </p>
        <p>
          When sending funds to another community member you can perform a lookup via name, gmail, or Minecraft name. To
          ensure transactions go to the correct party the information used to search for a community member will be
          confirmed. For privacy purposes display name from gmail will only ever be shown to community moderators,
          Minecraft names will always be shown (if provided) in search results but gmail will only be shown if it was
          used in the initial search for sending funds.
        </p>
      </section>
      <section class=card>
        <h3>Acknowledge</h3>
        <p>
          By clicking the button below, you approve of sharing information as outlined above.
        </p>
        <p class=center-content>
          <md-filled-button id=acknowledge @click=${acknowledgement}>SIGN ME UP!</md-filled-button>
        </p>
      </section>
    `;
  }
  private async acknowledgement() {
    const { invite } = this;
    try {
      if (!AuthService.currentUser) await AuthService.signIn();
      await BankService.optIn();
      if (invite) await BankService.joinCommunity({ invite });
      await RouterService.navigate(RouteName.Bank, { updateHistory: true, waitForRole: true });
    } catch (e) {
      const { message } = e as { message: string };
      alert(message);
    }
  }
}
