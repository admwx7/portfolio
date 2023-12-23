import { TemplateResult, css, html } from 'lit';
import { customElement, queryAll, state } from 'lit/decorators.js';
import { DocumentSnapshot } from 'firebase/firestore';
import BankService, { CommunityMember, CommunityRole } from '../../services/Bank';
import Page from '../../classes/page';
import { card } from '../../theme/shared-styles';
import { debounce } from '../../utils/timing';

import '@material/web/button/filled-button';
import '@material/web/button/outlined-button';
import '@material/web/textfield/filled-text-field';

/**
 * `am-page-bank` the banking landing page for managing accounts / community and checking funds
 */
@customElement('am-page-bank')
export class AmPageBank extends Page {
  static override styles = [
    ...Page.styles,
    card,
    css`
      td {
        text-align: center;
      }
      #actions {
        display: flex;
        flex-direction: column;
        gap: var(--padding);
      }
    `,
  ];

  private _communitiesDebouncer = debounce((communities) => {
    this._communities = [...communities as (DocumentSnapshot<CommunityMember> | null)[]];
    this.performUpdate();
  }, 250);
  private _subscription?: () => void;

  @state() private _communities: (DocumentSnapshot<CommunityMember> | null)[] = [];
  @state() private _searchedUser?: { userId: string, email?: string, community: string };
  @queryAll('[name]') private _formFields?: NodeList;

  constructor() {
    super();

    this._clearInputs = this._clearInputs.bind(this);
    this._fetchInputs = this._fetchInputs.bind(this);
    this._getCommunityInvite = this._getCommunityInvite.bind(this);
    this._renderCommunity = this._renderCommunity.bind(this);
    this.createCommunity = this.createCommunity.bind(this);
    this.deleteCommunity = this.deleteCommunity.bind(this);
    this.report = this.report.bind(this);
    this.search = this.search.bind(this);
    this.send = this.send.bind(this);
  }
  override async connectedCallback(): Promise<void> {
    super.connectedCallback?.();

    this._subscription = await BankService.list(this._communitiesDebouncer);
  }
  override disconnectedCallback(): void {
    super.disconnectedCallback?.();

    this._subscription?.();
  }
  override render(): TemplateResult {
    const { _clearInputs, _communities, _renderCommunity, _searchedUser, createCommunity, report, search, send } = this;
    return html`
      <section class=card>
        <h2>My Communities</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Balance</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
          ${_communities.map(_renderCommunity)}
        </table>
      </section>
      <section class=card>
        <h2>Create a Community</h2>
        <md-filled-text-field name=communityName label="Community Name"></md-filled-text-field>
        <md-filled-text-field
          name=communityStartingFunds
          type=number
          label="Member Starting Funds"
        ></md-filled-text-field>
        <md-outlined-button @click=${_clearInputs}>Cancel</md-outlined-button>
        <md-filled-button @click=${createCommunity}>Create</md-filled-button>
      </section>
      <section class=card>
        <h2>Send Funds</h2>
        <div ?hidden=${_searchedUser}>
          <md-filled-text-field name=userCommunity label=community></md-filled-text-field>
          <md-filled-text-field name=userEmail label=email></md-filled-text-field>
          <md-outlined-button @click=${_clearInputs}>Cancel</md-outlined-button>
          <md-filled-button @click=${search}>Search</md-filled-button>
        </div>
        <div ?hidden=${!_searchedUser}>
          <p>Found user ${_searchedUser?.email || _searchedUser?.userId}!</p>
          <p>How much would you like to send?</p>
          <md-filled-text-field name=sendAmount label=amount type=number></md-filled-text-field>
          <md-outlined-button
            @click=${() => { this._clearInputs(); this._searchedUser = undefined; }}
          >Cancel</md-outlined-button>
          <md-filled-button @click=${send}>Send</md-filled-button>
        </div>
      </section>
      <section class=card>
        <h2>Provide Feedback / Report a Bug</h2>
        <textarea name=feedbackText></textarea>
        <md-outlined-button @click=${_clearInputs}>Cancel</md-outlined-button>
        <md-filled-button @click=${report}>Submit</md-filled-button>
      </section>
      <section class=card>
        <!-- TODO -->
        <h2>Work In Progress</h2>
        <ul>
          <li>Updates to the communities list from the API can be finicky when reflecting into the UI</li>
          <li>Client-side form validation - server-side validation is in place, just want better feedback to users</li>
          <li>Member/Community management - a way to manage user permissions, gift/remove funds, or alter settings</li>
          <li>Theming / Styling / Layout - in particular page layout and button colors / accessibility</li>
          <li>Remove alerts - work great for PoC stage but look real bad, use confirmation modals instead</li>
          <li>Confirmation / visualization for destructive actions</li>
          <li>Finish documenting code</li>
          <li>Loading indicators for data driven content areas</li>
        </ul>
      </section>
      <section class=card>
        <!-- TODO -->
        <h2>Future Features</h2>
        <ul>
          <li>Frequently used list - last 5(?) account send / gift shortcuts</li>
          <li>Transaction history display</li>
          <li>Minecraft Bedrock Addon support</li>
          <li>Member lookup via MC account</li>
          <li>One time invite codes which auto-set community roles</li>
          <li>Disable "open" invite (current settings) allowing only one-time invite codes</li>
        </ul>
      </section>
    `;
  }

  private _clearInputs(): void {
    const elements = Array.from(this._formFields || []) as HTMLInputElement[];
    elements.forEach((el) => {
      el.value = '';
    });
  }
  private _fetchInputs(): Record<string, string | number> {
    const elements = Array.from(this._formFields || []) as HTMLInputElement[];
    return elements.reduce((acc, el) => {
      const key = el.getAttribute('name');
      const type = el.getAttribute('type');
      if (key) {
        let value: string | number;
        switch (type) {
          case 'number':
            value = Number(el.value);
            break;
          case 'text':
          default:
            value = el.value;
        }
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string | number>);
  }
  private _getCommunityInvite(community: string): void {
    alert(`New members can join your community via: https://amurdock.dev/bank-sign-up?invite=${community}`);
  }
  private _renderCommunity(community: DocumentSnapshot<CommunityMember> | null): TemplateResult {
    const { _getCommunityInvite, deleteCommunity } = this;

    const data = community?.data();
    if (!community || !data) return html`<tr></tr>`;
    const [, communityName] = community.ref.path.split('/');
    const role = data['role'].path as CommunityRole;

    return html`
      <tr>
        <td>${communityName}</td>
        <td>${data['funds']}</td>
        <td>${role.split('/').pop()}</td>
        <td ?hidden=${role === CommunityRole.Member}>
          <div id=actions>
            <md-filled-button
              @click=${_getCommunityInvite.bind(this, communityName!)}
            >INVITE</md-filled-button>
            <md-filled-button
              ?hidden=${role !== CommunityRole.Owner}
              @click=${deleteCommunity.bind(this, communityName!)}
            >DELETE</md-filled-button>
          </div>
        </td>
      </tr>
    `;
  }

  async createCommunity(): Promise<void> {
    const data = this._fetchInputs();
    try {
      await BankService.createCommunity({
        name: data['communityName'] as string,
        startingFunds: data['communityStartingFunds'] as number,
      });
      this._clearInputs();
      alert(`The new ${data['communityName']} community was created!`);
    } catch (e) {
      const { message } = e as { message: string };
      alert(message);
    }
  }
  async deleteCommunity(name: string): Promise<void> {
    try {
      await BankService.deleteCommunity({ name });
      alert(`${name} was successfully deleted.`);
    } catch (e) {
      const { message } = e as { message: string };
      alert(message);
    }
  }
  async report(): Promise<void> {
    const data = this._fetchInputs();
    try {
      await BankService.report({ text: data['feedbackText'] as string });
      this._clearInputs();
      alert('Feedback / Bug Report successfully submitted');
    } catch (e) {
      const { message } = e as { message: string };
      alert(message);
    }
  }
  async search(): Promise<void> {
    const data = this._fetchInputs();
    try {
      const community = data['userCommunity'] as string;
      const { data: { userId, email } } = await BankService.search({
        community,
        search: data['userEmail'] as string,
      });
      this._clearInputs();
      this._searchedUser = { userId, email, community };
    } catch (e) {
      const { message } = e as { message: string };
      alert(message);
    }
  }
  async send(): Promise<void> {
    const data = this._fetchInputs();
    try {
      if (!this._searchedUser) {
        // eslint-disable-next-line no-throw-literal
        throw { message: 'Must look up a user before attempting  to send funds.' };
      }
      const { community, userId } = this._searchedUser;
      await BankService.sendFunds({
        amount: data['sendAmount'] as number,
        community,
        to: userId,
      });
      this._clearInputs();
      this._searchedUser = undefined;
      alert('Funds successfully sent!');
    } catch (e) {
      const { message } = e as { message: string };
      alert(message);
    }
  }
}
