import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Tag, Modal, Tabs, message, Icon, Popconfirm, Input } from "antd";
import TagListHeader from "../components/TagListHeader";
import { toggleArrayItem } from "../../../lib/littleFn";
import {
  createContactTag,
  updateContactTagById,
  deleteContactTagById
} from "../../../fireQuery/tagsQuery";
import SimpleInputButton from "../../../commonCmps/SimpleInputButton";
import { parseTagFromLabel } from "../contactUtility";

@connect(state => ({
  tags: state.tagChunk.tags
}))
class TagListHeaderContainer extends Component {
  state = {
    edittingTags: false,
    newTagName: ""
  };

  onTagClick = tag => {
    const { onActiveTagsChange, activeTagKeys } = this.props;
    onActiveTagsChange(toggleArrayItem(activeTagKeys, tag.key));
  };

  addNewTag = label => {
    const tag = parseTagFromLabel(label);
    return createContactTag(tag).then(() =>
      message.success(`Tag ${tag.key} Created`)
    );
  };

  newTagNameError = label => {
    const { tags } = this.props;
    if (tags.find(tg => (tg.label || "").trim() === label.trim())) {
      return "Existed!";
    }
    return "";
  };

  unarchivedTag = tag => {
    updateContactTagById(tag._id, { archived: false }).then(() =>
      message.success(`Tag ${tag.label} restored`)
    );
  };

  archiveTag = tag => {
    updateContactTagById(tag._id, { archived: true }).then(() =>
      message.success(`Tag ${tag.label} archived`)
    );
  };

  startEdittingLabel = tag =>
    this.setState({
      tagInEdit: tag,
      tempLabel: tag.label
    });

  handleKeyPress = e => {
    if (e.key !== "Enter") return;
    const { tagInEdit, tempLabel } = this.state;
    if (this.editErrorMsg(tagInEdit.label, tempLabel) != null) return;

    updateContactTagById(tagInEdit._id, { label: tempLabel }).then(r => {
      message.success(`Tag ${tagInEdit.label} changed to ${tempLabel}`);
      this.setState({
        tagInEdit: null,
        tempLabel: ""
      });
    });
  };

  permanentlyDeleteTag = tag => {
    const { afterTagDelete } = this.props;
    return deleteContactTagById(tag._id).then(() => afterTagDelete(tag));
  };

  editErrorMsg = (oldLabel = "", newLabel = "") => {
    const { tags } = this.props;
    if (!newLabel.trim()) return "Cannot be blank";
    if (oldLabel.trim() === newLabel.trim()) return "";

    if (tags.find(tg => (tg.label || "").trim() === newLabel.trim())) {
      return "Existed!";
    }
    return null;
  };

  render() {
    const { onActiveTagsChange, tags, ...rest } = this.props;
    const { edittingTags, tagInEdit, tempLabel, newTagName } = this.state;
    const {
      addNewTag,
      newTagNameError,
      startEdittingLabel,
      handleKeyPress,
      editErrorMsg
    } = this;

    const renderActive = tag => (
      <div className="row" style={{ padding: 3 }}>
        <div className="col-10">
          {tagInEdit !== tag ? (
            <a onClick={() => startEdittingLabel(tag)}>{tag.label}</a>
          ) : (
            [
              <Input
                value={tempLabel}
                onKeyPress={handleKeyPress}
                onChange={e => this.setState({ tempLabel: e.target.value })}
                style={{ width: 120 }}
                suffix={
                  editErrorMsg(tag.label, tempLabel) == null && (
                    <Icon type="check" style={{ color: "green" }} />
                  )
                }
              />,
              <a
                style={{ marginLeft: 8 }}
                onClick={() => this.setState({ tagInEdit: null })}
              >
                Cancel
              </a>,
              <span className="tag-error danger text-danger">
                {editErrorMsg(tag.label, tempLabel)}
              </span>
            ]
          )}
        </div>
        <Popconfirm
          title={`Are you sure archive ${tag.label}?`}
          onConfirm={() => this.archiveTag(tag)}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <a>Archive</a>
        </Popconfirm>
      </div>
    );

    const renderArchived = tag => (
      <div className="row" style={{ padding: 3 }}>
        <div className="col-6"> {tag.label} </div>
        <a className="col-2" onClick={() => this.unarchivedTag(tag)}>
          Restore
        </a>
        <Popconfirm
          title={`Are you sure permanently ${tag.label}? \nThe app will also delete this tag from Contacts. \nThis action is not reversable`}
          onConfirm={() => this.permanentlyDeleteTag(tag)}
          onCancel={() => {}}
          okText="Yes"
          cancelText="No"
        >
          <a className="col-4 text-danger">permanently Delete</a>
        </Popconfirm>
      </div>
    );

    return (
      <span>
        <TagListHeader
          {...rest}
          tags={tags.filter(tg => !tg.archived)}
          onTagClick={this.onTagClick}
        />
        <Tag onClick={() => this.setState({ edittingTags: true })}>
          Manage Tags
        </Tag>
        {edittingTags && (
          <Modal
            visible={edittingTags}
            onCancel={() => this.setState({ edittingTags: false })}
            footer={null}
          >
            <Tabs>
              <Tabs.TabPane tab="Active Tags" key="1">
                <SimpleInputButton
                  text="New Tag"
                  okLabel="Create"
                  getErrorMsg={newTagNameError}
                  onSubmit={addNewTag}
                />
                {tags.filter(tg => !tg.archived).map(renderActive)}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Archived Tags" key="2">
                {tags.filter(tg => tg.archived).map(renderArchived)}
              </Tabs.TabPane>
            </Tabs>
          </Modal>
        )}
      </span>
    );
  }
}

TagListHeaderContainer.propTypes = {
  onActiveTagsChange: PropTypes.func,
  activeTagKeys: PropTypes.array,
  afterTagDelete: PropTypes.func,
  tags: PropTypes.arrayOf(PropTypes.object)
};

export default TagListHeaderContainer;