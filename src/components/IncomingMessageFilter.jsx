import { css, StyleSheet } from "aphrodite";
import AutoComplete from "material-ui/AutoComplete";
import { Card, CardHeader, CardText } from "material-ui/Card";
import MenuItem from "material-ui/MenuItem";
import SelectField from "material-ui/SelectField";
import TextField from "material-ui/TextField";
import Toggle from "material-ui/Toggle";
import type from "prop-types";
import React, { Component } from "react";

import { nameComponents } from "../lib/attributes";
import { ALL_TEXTERS, UNASSIGNED_TEXTER } from "../lib/constants";
import theme from "../styles/theme";
import { dataSourceItem } from "./utils";

const styles = StyleSheet.create({
  container: {
    ...theme.layouts.multiColumn.container,
    alignContent: "flex-start",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    alignItems: "center"
  },
  flexColumn: {
    width: "30%"
  },
  toggleFlexColumn: {
    width: "30%"
  },
  spacer: {
    marginRight: "30px"
  }
});

export const MESSAGE_STATUSES = {
  all: {
    name: "All",
    children: ["needsResponse", "needsMessage", "convo", "messaged"]
  },
  needsResponse: {
    name: "Needs Texter Response",
    children: []
  },
  needsMessage: {
    name: "Needs First Message",
    children: []
  },
  convo: {
    name: "Active Conversation",
    children: []
  },
  messaged: {
    name: "First Message Sent",
    children: []
  },
  closed: {
    name: "Closed",
    children: []
  }
};

export const ALL_CAMPAIGNS = -1;

export const CAMPAIGN_TYPE_FILTERS = [[ALL_CAMPAIGNS, "All Campaigns"]];

export const TEXTER_FILTERS = [
  [UNASSIGNED_TEXTER, "Unassigned"],
  [ALL_TEXTERS, "All Texters"]
];

const IDLE_KEY_TIME = 500;

class IncomingMessageFilter extends Component {
  state = {
    firstName: undefined,
    lastName: undefined
  };

  submitNameUpdateTimeout = undefined;

  onMessageFilterSelectChanged = (event, index, values) => {
    this.setState({ messageFilter: values });
    const messageStatuses = new Set();
    values.forEach((value) => {
      const { children } = MESSAGE_STATUSES[value];
      if (children.length > 0) {
        children.forEach((child) => messageStatuses.add(child));
      } else {
        messageStatuses.add(value);
      }
    });

    const messageStatusesString = Array.from(messageStatuses).join(",");
    this.props.onMessageFilterChanged(messageStatusesString);
  };

  onCampaignSelected = (selection, index) => {
    let campaignId;
    if (index === -1) {
      const campaign = this.props.texters.find(
        ({ title }) => title === selection
      );
      if (campaign) {
        campaignId = campaign.id;
      }
    } else {
      campaignId = selection.value.key;
    }
    if (campaignId) {
      this.props.onCampaignChanged(parseInt(campaignId, 10));
    }
  };

  onTexterSelected = (selection, index) => {
    let texterUserId;
    if (index === -1) {
      const texter = this.props.texters.find(
        ({ displayName }) => displayName === selection
      );
      if (texter) {
        texterUserId = texter.id;
      }
    } else {
      texterUserId = selection.value.key;
    }
    if (texterUserId) {
      this.props.onTexterChanged(parseInt(texterUserId, 10));
    }
  };

  onContactNameChanged = (ev) => {
    const name = ev.target.value;
    const { firstName, lastName } = nameComponents(name);
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.firstName = firstName;
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.lastName = lastName;
    clearTimeout(this.submitNameUpdateTimeout);
    this.submitNameUpdateTimeout = setTimeout(
      this.searchByNewContactName,
      IDLE_KEY_TIME
    );
  };

  searchByNewContactName = () => {
    const { firstName, lastName } = this.state;
    this.props.searchByContactName({ firstName, lastName });
  };

  render() {
    const texterNodes = TEXTER_FILTERS.map((texterFilter) =>
      dataSourceItem(texterFilter[1], texterFilter[0])
    ).concat(
      !this.props.texters
        ? []
        : this.props.texters.map((user) => {
            const userId = parseInt(user.id, 10);
            return dataSourceItem(user.displayName, userId);
          })
    );
    texterNodes.sort((left, right) => {
      return left.text.localeCompare(right.text, "en", { sensitivity: "base" });
    });

    const campaignNodes = CAMPAIGN_TYPE_FILTERS.map((campaignTypeFilter) =>
      dataSourceItem(campaignTypeFilter[1], campaignTypeFilter[0])
    ).concat(
      !this.props.campaigns
        ? []
        : this.props.campaigns.map((campaign) => {
            const campaignId = parseInt(campaign.id, 10);
            const campaignDisplay = `${campaignId}: ${campaign.title}`;
            return dataSourceItem(campaignDisplay, campaignId);
          })
    );
    campaignNodes.sort((left, right) => {
      return left.text.localeCompare(right.text, "en", { sensitivity: "base" });
    });

    return (
      <Card>
        <CardHeader title="Message Filter" actAsExpander showExpandableButton />
        <CardText expandable>
          <div className={css(styles.container)}>
            <div className={css(styles.toggleFlexColumn)}>
              <Toggle
                label="Active Campaigns"
                onToggle={this.props.onActiveCampaignsToggled}
                toggled={
                  this.props.includeActiveCampaigns ||
                  !this.props.includeArchivedCampaigns
                }
              />
              <br />
              <Toggle
                label="Archived Campaigns"
                onToggle={this.props.onArchivedCampaignsToggled}
                toggled={this.props.includeArchivedCampaigns}
              />
            </div>
            <div className={css(styles.spacer)} />
            <div className={css(styles.toggleFlexColumn)}>
              <Toggle
                label="Not Opted Out"
                onToggle={this.props.onNotOptedOutConversationsToggled}
                toggled={
                  this.props.includeNotOptedOutConversations ||
                  !this.props.includeOptedOutConversations
                }
              />
              <br />
              <Toggle
                label="Opted Out"
                onToggle={this.props.onOptedOutConversationsToggled}
                toggled={this.props.includeOptedOutConversations}
              />
            </div>
            {this.props.isIncludeEscalatedFilterable && (
              <div className={css(styles.toggleFlexColumn)}>
                <Toggle
                  label="Include Escalated"
                  toggled={this.props.includeEscalated}
                  onToggle={this.props.onIncludeEscalatedChanged}
                />
              </div>
            )}
          </div>

          <div className={css(styles.container)}>
            <div className={css(styles.flexColumn)}>
              <SelectField
                multiple
                value={this.state.messageFilter}
                hintText="Which messages?"
                floatingLabelText="Contact message status"
                floatingLabelFixed
                onChange={this.onMessageFilterSelectChanged}
              >
                {Object.keys(MESSAGE_STATUSES).map((messageStatus) => {
                  const displayText = MESSAGE_STATUSES[messageStatus].name;
                  const isChecked =
                    this.state.messageFilter &&
                    this.state.messageFilter.indexOf(messageStatus) > -1;
                  return (
                    <MenuItem
                      key={messageStatus}
                      value={messageStatus}
                      primaryText={displayText}
                      insetChildren
                      checked={isChecked}
                    />
                  );
                })}
              </SelectField>
            </div>
            <div className={css(styles.spacer)} />
            <div className={css(styles.flexColumn)}>
              <AutoComplete
                filter={AutoComplete.caseInsensitiveFilter}
                maxSearchResults={8}
                onFocus={() => this.setState({ campaignSearchText: "" })}
                onUpdateInput={(campaignSearchText) =>
                  this.setState({ campaignSearchText })
                }
                searchText={this.state.campaignSearchText}
                dataSource={campaignNodes}
                hintText="Search for a campaign"
                floatingLabelText="Campaign"
                onNewRequest={this.onCampaignSelected}
              />
            </div>
            <div className={css(styles.spacer)} />
            {this.props.isTexterFilterable && (
              <div className={css(styles.flexColumn)}>
                <AutoComplete
                  filter={AutoComplete.caseInsensitiveFilter}
                  maxSearchResults={8}
                  onFocus={() => this.setState({ texterSearchText: "" })}
                  onUpdateInput={(texterSearchText) =>
                    this.setState({ texterSearchText })
                  }
                  searchText={this.state.texterSearchText}
                  dataSource={texterNodes}
                  disabled={this.props.texters.length === 0}
                  hintText={
                    this.props.texters.length === 0
                      ? `Loading texters (${Math.floor(
                          this.props.textersLoadedFraction * 100
                        )}%)...`
                      : "Search for a texter"
                  }
                  floatingLabelText={
                    this.props.texters.length === 0
                      ? `Loading texters (${Math.floor(
                          this.props.textersLoadedFraction * 100
                        )}%)...`
                      : "Texter"
                  }
                  onNewRequest={this.onTexterSelected}
                />
              </div>
            )}
            <div className={css(styles.spacer)} />
            <TextField
              onChange={this.onContactNameChanged}
              fullWidth
              floatingLabelText="Filter by Contact Name"
            />
          </div>

          <div className={css(styles.spacer)}>
            <div className={css(styles.flexColumn)}>
              <SelectField
                multiple
                value={this.props.tagsFilter}
                hintText="Filter by Contact Tags"
                fullWidth
                floatingLabelFixed
                onChange={this.props.onTagsChanged}
              >
                {this.props.tags.map(({ id, title }) => {
                  const isChecked =
                    this.props.tagsFilter && this.props.tagsFilter.includes(id);

                  return (
                    <MenuItem
                      key={id}
                      value={id}
                      primaryText={title}
                      insetChildren
                      checked={isChecked}
                    />
                  );
                })}
              </SelectField>
            </div>
          </div>
        </CardText>
      </Card>
    );
  }
}

IncomingMessageFilter.propTypes = {
  isTexterFilterable: type.bool.isRequired,
  isIncludeEscalatedFilterable: type.bool.isRequired,
  onCampaignChanged: type.func.isRequired,
  onTagsChanged: type.func.isRequired,
  onTexterChanged: type.func.isRequired,
  includeEscalated: type.bool.isRequired,
  onIncludeEscalatedChanged: type.func.isRequired,
  onActiveCampaignsToggled: type.func.isRequired,
  onArchivedCampaignsToggled: type.func.isRequired,
  includeArchivedCampaigns: type.bool.isRequired,
  includeActiveCampaigns: type.bool.isRequired,
  onNotOptedOutConversationsToggled: type.func.isRequired,
  onOptedOutConversationsToggled: type.func.isRequired,
  includeNotOptedOutConversations: type.bool.isRequired,
  includeOptedOutConversations: type.bool.isRequired,
  campaigns: type.array.isRequired,
  texters: type.array.isRequired,
  onMessageFilterChanged: type.func.isRequired,
  assignmentsFilter: type.shape({
    texterId: type.number
  }).isRequired,
  tags: type.arrayOf(type.shape({ id: type.string, title: type.string })),
  tagsFilter: type.arrayOf(type.string).isRequired
};

export default IncomingMessageFilter;
