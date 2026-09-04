import React from 'react';
import { ConstructionMarketplaceView } from './ConstructionMarketplaceView';
import { MaterialItem } from '../types';

interface Props {
  onApplyMaterialToProject?: (material: MaterialItem) => void;
}

export const MaterialsCatalogView: React.FC<Props> = ({ onApplyMaterialToProject }) => {
  return <ConstructionMarketplaceView onApplyItemToProject={onApplyMaterialToProject} />;
};
