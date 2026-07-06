import { observer } from 'mobx-react-lite';
import { stores } from '../../../../stores';
import { MenuTypes } from '../../../../types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';

export const ItemListSearchBar = observer(() => {
  const { applicationStore, agentStore, assetStore, operationStore, dispatchStore } = stores;
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        setSearchValue(assetStore.listSearchValue);
        break;
      case MenuTypes.Agents:
        setSearchValue(agentStore.listSearchValue);
        break;
      case MenuTypes.Operations:
        setSearchValue(operationStore.listSearchValue);
        break;
      case MenuTypes.Dispatches:
        setSearchValue(dispatchStore.listSearchValue);
        break;
    }
  }, [applicationStore.currentMenu]);

  useEffect(() => {
    switch (applicationStore.currentMenu) {
      case MenuTypes.Assets:
        assetStore.setSearchValue(searchValue);
        break;
      case MenuTypes.Agents:
        agentStore.setSearchValue(searchValue);
        break;
      case MenuTypes.Operations:
        operationStore.setSearchValue(searchValue);
        break;
      case MenuTypes.Dispatches:
        dispatchStore.setSearchValue(searchValue);
        break;
    }
  }, [searchValue]);

  return (
    <div className="item-list-search-bar">
      <Search className="item-list-search-bar-icon" size={20} />
      <input
        className="item-list-search-bar-input"
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={t('itemList.searchPlaceholder')}
      />
      {searchValue && (
        <button className="item-list-search-bar-clear" onClick={() => setSearchValue('')}>
          <X size={20} />
        </button>
      )}
    </div>
  );
});
