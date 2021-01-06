import { differenceBy } from "lodash";
import ChipInput from "material-ui-chip-input";
import RaisedButton from "material-ui/RaisedButton";
import Toggle from "material-ui/Toggle";
import PropTypes from "prop-types";
import React from "react";
import Form from "react-formal";
import * as yup from "yup";

import GSForm from "../../../components/forms/GSForm";
import CampaignFormSectionHeading from "../components/CampaignFormSectionHeading";

const formSchema = yup.object({
  isAssignmentLimitedToTeams: yup.boolean()
});

const styles = {
  button: {
    display: "inline-block",
    marginTop: 15
  }
};

class CampaignTeamsForm extends React.Component {
  onIsAssignmentLimitedToTeamsDidToggle = (
    _event,
    isAssignmentLimitedToTeams
  ) => {
    this.props.onChange({ isAssignmentLimitedToTeams });
  };

  // Prevent user-defined teams
  handleBeforeRequestAdd = ({ id: tagId, title }) =>
    !Number.isNaN(tagId) && tagId !== title;

  handleAddTeam = ({ id: selectedTeamId }) => {
    const { orgTeams } = this.props;
    const { teams: currentTeams } = this.props.formValues;
    const addableTeams = differenceBy(orgTeams, currentTeams, "id");
    this.props.onChange({
      teams: currentTeams.concat(
        addableTeams.filter((team) => team.id === selectedTeamId)
      )
    });
  };

  handleRemoveTeam = (deleteTeamId) => {
    const teams = this.props.formValues.teams.filter(
      (team) => team.id !== deleteTeamId
    );
    this.props.onChange({ teams });
  };

  render() {
    const {
      saveLabel,
      saveDisabled,
      formValues,
      orgTeams,
      onChange
    } = this.props;

    return (
      <div>
        <div>
          <div>formValues.teams</div>
          <div>{JSON.stringify(formValues.teams)}</div>
        </div>
        <GSForm schema={formSchema} value={formValues} onChange={onChange}>
          <CampaignFormSectionHeading
            title="Teams for campaign"
            subtitle="Optionally prioritize assigning texters from specific teams for this campaign by selecting them below. Restrict assignment solely to members of selected teams by using the toggle below."
          />

          <ChipInput
            value={formValues.teams}
            dataSourceConfig={{ text: "title", value: "id" }}
            dataSource={orgTeams}
            placeholder="Select teams"
            fullWidth
            openOnFocus
            onBeforeRequestAdd={this.handleBeforeRequestAdd}
            onRequestAdd={this.handleAddTeam}
            onRequestDelete={this.handleRemoveTeam}
          />

          <br />

          <Form.Field
            name="isAssignmentLimitedToTeams"
            type={Toggle}
            toggled={formValues.isAssignmentLimitedToTeams}
            label="Restrict assignment solely to members of these teams?"
            onToggle={this.onIsAssignmentLimitedToTeamsDidToggle}
          />
        </GSForm>
        <RaisedButton
          label={saveLabel}
          disabled={saveDisabled}
          onClick={this.props.onSubmit}
          style={styles.button}
        />
      </div>
    );
  }
}

CampaignTeamsForm.propTypes = {
  formValues: PropTypes.object.isRequired,
  orgTeams: PropTypes.arrayOf(PropTypes.object).isRequired,
  saveDisabled: PropTypes.bool.isRequired,
  saveLabel: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default CampaignTeamsForm;
