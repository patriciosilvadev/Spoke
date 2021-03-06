import Chip from "material-ui/Chip";
import Paper from "material-ui/Paper";
import RaisedButton from "material-ui/RaisedButton";
import { red500 } from "material-ui/styles/colors";
import CheckCircleIcon from "material-ui/svg-icons/action/check-circle";
import DeleteForeverIcon from "material-ui/svg-icons/action/delete-forever";
import BlockIcon from "material-ui/svg-icons/content/block";
import CreateIcon from "material-ui/svg-icons/content/create";
import PropTypes from "prop-types";
import React, { Component } from "react";

const styles = {
  wrapper: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start"
  },
  card: {
    margin: 10,
    padding: 10
  },
  chip: {
    marginRight: "auto",
    color: "#000000"
  },
  description: {
    maxWidth: "200px"
  }
};

class TagEditorList extends Component {
  createHandleEditTag = (tagId) => () => this.props.oEditTag(tagId);

  createHandleDeleteTag = (tagId) => () => this.props.onDeleteTag(tagId);

  render() {
    const { tags } = this.props;

    return (
      <div style={styles.wrapper}>
        {tags.map((tag) => (
          <Paper key={tag.id} style={styles.card}>
            <div style={{ display: "flex" }}>
              <Chip
                backgroundColor={tag.backgroundColor}
                labelColor={tag.textColor}
                style={styles.chip}
              >
                {tag.title}
              </Chip>
            </div>
            {tag.description && (
              <p style={styles.description}>{tag.description}</p>
            )}
            <p>
              Assignable?{" "}
              {tag.isAssignable ? <CheckCircleIcon /> : <BlockIcon />}
            </p>
            <div style={{ display: "flex" }}>
              <RaisedButton
                label="Edit"
                labelPosition="before"
                disabled={tag.isSystem}
                primary
                icon={<CreateIcon />}
                style={{ marginRight: 10 }}
                onClick={this.createHandleEditTag(tag.id)}
              />
              <RaisedButton
                label="Delete"
                labelPosition="before"
                disabled={tag.isSystem}
                icon={
                  <DeleteForeverIcon
                    color={!tag.isSystem ? red500 : undefined}
                  />
                }
                onClick={this.createHandleDeleteTag(tag.id)}
              />
            </div>
            {tag.isSystem && <p>System tags cannot be edited</p>}
          </Paper>
        ))}
      </div>
    );
  }
}

TagEditorList.defaultProps = {};

TagEditorList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.object).isRequired,
  oEditTag: PropTypes.func.isRequired,
  onDeleteTag: PropTypes.func.isRequired
};

export default TagEditorList;
