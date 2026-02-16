import { useState } from 'react';

interface CustomList {
  id: string;
  name: string;
  items: ListItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface ListItem {
  id: string | number;
  type: 'artist' | 'event' | 'site' | 'product';
}

export const useCustomLists = () => {
  const [lists, setLists] = useState<CustomList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const createList = (name: string) => {
    const newList: CustomList = {
      id: Date.now().toString(),
      name,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setLists(prev => [...prev, newList]);
    return newList;
  };

  const renameList = (id: string, newName: string) => {
    setLists(prev => 
      prev.map(list => 
        list.id === id 
          ? { ...list, name: newName, updatedAt: new Date() }
          : list
      )
    );
  };

  const deleteList = (id: string) => {
    setLists(prev => prev.filter(list => list.id !== id));
    if (selectedListId === id) {
      setSelectedListId(null);
    }
  };

  const addItemToList = (listId: string, item: ListItem) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { 
              ...list, 
              items: [...list.items, item],
              updatedAt: new Date()
            }
          : list
      )
    );
  };

  const removeItemFromList = (listId: string, itemId: string | number) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? { 
              ...list, 
              items: list.items.filter(item => item.id !== itemId),
              updatedAt: new Date()
            }
          : list
      )
    );
  };

  const getListsForItem = (itemId: string | number, itemType: string) => {
    return lists.filter(list =>
      list.items.some(item => item.id === itemId && item.type === itemType)
    );
  };

  const getItemsInList = (listId: string) => {
    const list = lists.find(l => l.id === listId);
    return list?.items || [];
  };

  return {
    lists,
    selectedListId,
    setSelectedListId,
    createList,
    renameList,
    deleteList,
    addItemToList,
    removeItemFromList,
    getListsForItem,
    getItemsInList,
  };
};
