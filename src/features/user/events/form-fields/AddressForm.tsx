import { useState, useEffect } from "react";
import axios from "axios";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BaseLocation {
  id: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  code: string;
}

interface RegionType extends BaseLocation {}
interface ProvinceType extends BaseLocation {}
interface MunicipalityType extends BaseLocation {
  zip_code: string;
  district: string;
  type: string;
  region_id: number;
  province_id: number;
}
interface BarangayType extends BaseLocation {
  status: string;
  region_id: number;
  province_id: number;
  city_municipality_id: number;
}

interface AddressFormProps {
  form: any;
}

const AddressForm = ({ form }: AddressFormProps) => {
  const [regions, setRegions] = useState<RegionType[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionType | undefined>(
    undefined,
  );
  const [provinces, setProvinces] = useState<ProvinceType[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<
    ProvinceType | undefined
  >(undefined);
  const [municipalities, setMunicipalities] = useState<MunicipalityType[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    MunicipalityType | undefined
  >(undefined);
  const [barangays, setBarangays] = useState<BarangayType[]>([]);
  const [selectedBarangay, setSelectedBarangay] = useState<
    BarangayType | undefined
  >(undefined);

  useEffect(() => {
    if (!regions.length) {
      axios
        .get("https://psgc.cloud/api/regions")
        .then((response) => {
          setRegions(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [regions, setRegions]);

  useEffect(() => {
    if (selectedRegion) {
      axios
        .get(`https://psgc.cloud/api/regions/${selectedRegion.code}/provinces`)
        .then((response) => {
          setProvinces(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setProvinces([]);
    }
  }, [selectedRegion, setProvinces]);

  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(
          `https://psgc.cloud/api/provinces/${selectedProvince.code}/municipalities`,
        )
        .then((response) => {
          setMunicipalities(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setMunicipalities([]);
    }
  }, [selectedProvince, setMunicipalities]);

  useEffect(() => {
    if (selectedMunicipality) {
      axios
        .get(
          `https://psgc.cloud/api/municipalities/${selectedMunicipality.code}/barangays`,
        )
        .then((response) => {
          setBarangays(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setBarangays([]);
    }
  }, [selectedMunicipality, setBarangays]);

  useEffect(() => {
    if (selectedBarangay) {
      form.setValue("region", selectedRegion?.name);
      form.setValue(
        "address",
        `${selectedBarangay.name}, ${selectedMunicipality?.name}, ${selectedProvince?.name}`,
      );
    }
  }, [
    selectedBarangay,
    form,
    selectedRegion,
    selectedProvince,
    selectedMunicipality,
  ]);

  const handleRegionChange = (value: string) => {
    const userSelectedRegion = regions.find((region) => region.name === value);
    setSelectedRegion(userSelectedRegion);
    setSelectedProvince(undefined);
    setSelectedMunicipality(undefined);
    setSelectedBarangay(undefined);
  };

  const handleProvinceChange = (value: string) => {
    const userSelectedProvince = provinces.find(
      (province) => province.name === value,
    );
    setSelectedProvince(userSelectedProvince);
    setSelectedMunicipality(undefined);
    setSelectedBarangay(undefined);
  };

  const handleMunicipalityChange = (value: string) => {
    const userSelectedMunicipality = municipalities.find(
      (municipality) => municipality.name === value,
    );
    setSelectedMunicipality(userSelectedMunicipality);
    setSelectedBarangay(undefined);
  };

  const handleBarangayChange = (value: string) => {
    const userSelectedBarangay = barangays.find(
      (barangay) => barangay.name === value,
    );
    setSelectedBarangay(userSelectedBarangay);
  };

  return (
    <div className="">
      <div className="flex flex-col gap-3">
        <Select
          value={selectedRegion?.name}
          onValueChange={(value) => handleRegionChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Region" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region.name} value={region.name}>
                {region.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedRegion && (
          <Select
            value={selectedProvince?.name}
            onValueChange={(value) => handleProvinceChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Province" />
            </SelectTrigger>
            <SelectContent>
              {provinces.map((province) => (
                <SelectItem key={province.name} value={province.name}>
                  {province.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {selectedProvince && (
          <Select
            value={selectedMunicipality?.name}
            onValueChange={(value) => handleMunicipalityChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Municipality" />
            </SelectTrigger>
            <SelectContent>
              {municipalities.map((municipality) => (
                <SelectItem key={municipality.name} value={municipality.name}>
                  {municipality.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {selectedMunicipality && (
          <Select
            value={selectedBarangay?.name}
            onValueChange={(value) => handleBarangayChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Barangay" />
            </SelectTrigger>
            <SelectContent>
              {barangays.map((barangay) => (
                <SelectItem key={barangay.name} value={barangay.name}>
                  {barangay.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};

export default AddressForm;
