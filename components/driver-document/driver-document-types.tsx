import { useAppDispatch, useTypedSelector } from "@/store";
import { View } from "react-native";
import DriverDocumentFormCard from "./driver-document-form";

const DriverDocumentTypes = () => {
  const { driverUploadedDocuments, driverDocumentTypes, driverDocumentLoading } = useTypedSelector(
    state => state.Driver
  );

  return (
    <View className="w-full h-auto rounded-lg flex flex-col items-center justify-center gap-5">
      {driverDocumentTypes?.map(item => <DriverDocumentFormCard data={item} />)}
    </View>
  );
};

export default DriverDocumentTypes;
