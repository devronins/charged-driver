import { ScrollView, View } from "react-native";
import DriverDocumentTypes from "@/components/driver-document/driver-document-types";
import DriverDocumentInfo from "@/components/driver-document/driver-document-info";
import { useAppDispatch, useTypedSelector } from "@/store";
import { useEffect } from "react";
import { getDriverDocumentTypes } from "@/services";
import Loader from "@/components/ui/Loader";

const DriverDocument = () => {
  const { driverDocumentLoading } = useTypedSelector(state => state.Driver);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getDriverDocumentTypes({}));
  }, []);

  if (driverDocumentLoading) return <Loader open={driverDocumentLoading} />;

  return (
    <ScrollView className="flex-1 bg-secondary-300">
      <View className=" flex-1 flex flex-col items-center p-6 gap-5">
        <DriverDocumentInfo />
        <DriverDocumentTypes />
      </View>
    </ScrollView>
  );
};

export default DriverDocument;
