// "use client";

import React, { useEffect, useState, useCallback, useContext } from 'react';
import { BookContext } from '@/contexts/bookContext'
import update from 'immutability-helper'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Card from './card';
import NewCard from '@/components/new-card';
import { useRouter, useParams } from 'next/navigation'

import Chapter from '@/models/chapter';

export default function() {
  // const cardsMap = new Map<number, any>();
  const router = useRouter()
  const params = useParams()

  const book = params.book;

  const context = useContext(BookContext);

  const { summary } = context;

  // const [summary, setSummary] = useState<Summary>();
  const [cards, setCards] = useState<Chapter[]>([]);

  useEffect(() => {
    console.warn('on context changed', summary);
    if (!summary) {
      return;
    }

    setCards([...summary.data]);
  }, [context])

  const handleNewChapter = (val: string) => {
    const chapter = new Chapter({
      slug: val,
      book: book
    });
    summary?.add(chapter)
      .then((id) => {
        router.push(`/${book}/${id}`)
        setCards([...summary.data]);
      });
  }

  const moveCard = useCallback((dragIndex: number, hoverIndex:number) => {
    setCards((prevCards) => {
      const sorted = update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex]],
        ],
      })

      summary.data = sorted;
      summary.update();

      return sorted;
    })
  }, [summary])

  const moveLevel = useCallback((dragIndex: number, level: number) => {
    setCards((prevCards) => {
      const chapter = prevCards[dragIndex];
      if (chapter.level == level) {
        return prevCards;
      }
  
      chapter.update({ level });
      summary?.update();
      return prevCards.slice()
    })
  }, [summary])

  const chapterCards = cards?.map((card, index) => {
    return (
      <Card
        key={index}
        index={index}
        id={card.slug}
        text={card.title}
        level={card.level || 0}
        path={`/${book}/${card.id}`}
        active={params.chapter === card.id}
        moveCard={moveCard}
        moveLevel={moveLevel}
      />
    )
  });

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <ul className="summary">  
          { chapterCards }
        </ul>
      </DndProvider>
      <NewCard
        onAdd={(val: string) => handleNewChapter(val)}
      ></NewCard>
    </>
  )
}