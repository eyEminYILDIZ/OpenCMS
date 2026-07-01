import React from 'react';
import { AssetApi } from '../../../api';
import {
  AircraftMarker,
  AirGunMarker,
  BuildingMarker,
  PersonGroupMarker,
  PersonMarker,
  RadarMarker,
  ShipMarker,
  SubmarineMarker,
  UnknownMarker,
  VehicleMarker,
} from './index';

interface AssetMarkerOptions {
  size?: number;
  color?: string;
}

export function getAssetMarker(
  assetType: AssetApi.Enums.AssetTypes,
  options?: AssetMarkerOptions,
): React.ReactElement {
  switch (assetType) {
    case AssetApi.Enums.AssetTypes.Aircraft: return <AircraftMarker {...options} />;
    case AssetApi.Enums.AssetTypes.Ship: return <ShipMarker {...options} />;
    case AssetApi.Enums.AssetTypes.Submarine: return <SubmarineMarker {...options} />;
    case AssetApi.Enums.AssetTypes.Vehicle: return <VehicleMarker {...options} />;
    case AssetApi.Enums.AssetTypes.Building: return <BuildingMarker {...options} />;
    case AssetApi.Enums.AssetTypes.Person: return <PersonMarker {...options} />;
    case AssetApi.Enums.AssetTypes.GroupOfPeople: return <PersonGroupMarker {...options} />;
    case AssetApi.Enums.AssetTypes.Radar: return <RadarMarker {...options} />;
    case AssetApi.Enums.AssetTypes.AirGun: return <AirGunMarker {...options} />;
    default: return <UnknownMarker {...options} />;
  }
}
