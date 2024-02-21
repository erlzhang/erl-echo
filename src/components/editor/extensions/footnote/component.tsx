import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import React, { useState } from 'react';

export default function({ node, editor, }) {

  const navTo = () => {

  }

  return (
    <NodeViewWrapper className="footnote">
      <p>
        1.
        <NodeViewContent className="content" as="span" />
        <a
          onClick={() => navTo(1)}
        >↩</a>
      </p>
      
    </NodeViewWrapper>
  )
}