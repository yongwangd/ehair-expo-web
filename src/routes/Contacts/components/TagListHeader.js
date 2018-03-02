import React from "react";
import { Tag } from "antd";
import PropTypes from "prop-types";

const TagListHeader = props => {
  const { tags, activeTagKeys, onTagClick, ...rest } = props;

  const tagColor = tag => (activeTagKeys.includes(tag.key) ? "#f50" : "blue");

  const renderTag = tag => (
    <Tag
      onClick={() => onTagClick(tag)}
      color={tagColor(tag)}
      key={tag.key}
      style={{ marginBottom: 7 }}
    >
      {tag.label}
    </Tag>
  );

  return <span {...rest}>{tags.map(renderTag)}</span>;
};

TagListHeader.propTypes = {
  tags: PropTypes.array.isRequired,
  activeTagKeys: PropTypes.array.isRequired,
  onTagClick: PropTypes.func.isRequired
};

export default TagListHeader;