import {
  Status,
  Category,
  WritingMode
} from '@/models/book';
import { GiCoffeeCup, GiChestnutLeaf, GiQuillInk, GiKeyboard } from "react-icons/gi";
import { FcIdea, FcFeedback, FcApproval, FcReadingEbook } from "react-icons/fc";
import Image from 'next/image'
import React from 'react';

export const STATUS =  {
  [Status.New]: {
    icon: <FcIdea/>,
    label: '构思中',
    color: [238, 224, 218]
  },
  [Status.Writing]: {
    icon: <Image src="/icons/write.png" alt="" width="20" height="20" />,
    label: '写作中',
    color: [211, 229, 239]
  },
  [Status.Finished]: {
    icon: <FcApproval/>,
    label: '初稿完成',
    color: [219, 237, 219]
  },
  [Status.Modifying]: {
    icon: <FcReadingEbook/>,
    label: '修改中',
    color: [255, 226, 221]
  },
  [Status.Published]: {
    icon: <FcFeedback/>,
    label: '已发布',
    color: [245, 224, 233]
  }
};

export const CATEGORY = {
  [Category.Eassy]: {
    icon: <GiCoffeeCup></GiCoffeeCup>,
    label: '随笔'
  },
  [Category.Novel]: {
    icon: <GiChestnutLeaf></GiChestnutLeaf>,
    label: '小说'
  }
}

export const WRITING_MODE = {
  [WritingMode.HandWriting]: {
    label: '手写',
    icon: <GiQuillInk/>
  },
  [WritingMode.Type]: {
    label: '码字',
    icon: <GiKeyboard></GiKeyboard>
  }
}