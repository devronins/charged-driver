import { useAppDispatch, useTypedSelector } from '@/store';
import { View } from 'react-native';
import DriverDocumentFormCard from './driver-document-form-card';
import { DriverUploadedDocumentModal } from '@/utils/modals/driver';

const DriverDocumentTypes = () => {
  const { driverUploadedDocuments, driverDocumentTypes, driverDocumentLoading, accessToken } =
    useTypedSelector((state) => state.Driver);
  const uploadedDocumentsMap = new Map<number, DriverUploadedDocumentModal>();

  if (driverUploadedDocuments?.length) {
    driverUploadedDocuments.forEach((item) =>
      uploadedDocumentsMap.set(item.document_type_id, item)
    );
  }

  return (
    <View className="w-full h-auto rounded-lg flex flex-col items-center justify-center gap-5">
      {driverDocumentTypes?.map((item) => (
        <DriverDocumentFormCard
          data={item}
          uploadedDocumentData={uploadedDocumentsMap.get(item.id) || null}
        />
      ))}
    </View>
  );
};

export default DriverDocumentTypes;
