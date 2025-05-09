// components/FullScreenSelect.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Search, Check } from 'lucide-react-native';
import { Model } from './model';

interface FullScreenSelectProps {
  options: { value: string; label: string }[];
  value: string | null | undefined;
  onChange: (value: string) => void;
  label?: string;
  error?: string | null;
  placeholder?: string;
  containerStyle?: string;
  inputStyle?: string;
  disabled?: boolean;
}

const Select: React.FC<FullScreenSelectProps> = ({
  options,
  value,
  onChange,
  label,
  error,
  placeholder = 'Select an option',
  containerStyle,
  inputStyle,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filtered, setFiltered] = useState<{ value: string; label: string }[]>(options);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (searchText.trim() === '') {
      setFiltered(options);
    } else {
      const lower = searchText.toLowerCase();
      setFiltered(options.filter((opt) => opt.label.toLowerCase().includes(lower)));
    }
  }, [searchText, options]);

  return (
    <View className="w-full">
      {label && <Text className="text-lg font-[500] mb-2">{label}</Text>}

      <TouchableOpacity
        onPress={() => (disabled ? {} : setOpen(true))}
        className={`flex flex-row justify-start items-center relative rounded-md ${Platform.OS === 'ios' ? 'px-3 py-4' : 'px-3 py-3'} font-normal text-sm text-text-300 border ${error ? 'border-red-500' : isFocused ? 'border-primary-300' : 'border-border-300'} ${containerStyle}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <Text
          className={`rounded-md font-normal text-[18px] text-text-300 flex-1 ${inputStyle} text-left`}
        >
          {options?.find((item) => item.value === value)?.label?.toUpperCase() || placeholder}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}

      <Model
        open={open}
        animationType="slide"
        transparent={true}
        setValue={() => setOpen(false)}
        className="flex-1 justify-end items-center bg-black/30"
      >
        <View className="bg-white rounded-lg w-full max-h-[80%] px-4 py-3">
          {/* Search bar + Close */}
          <View className="flex-row items-center justify-center border-b border-gray-200 gap-3 pb-3">
            <View className="relative flex-1">
              <TextInput
                placeholder="Search..."
                className="h-11 pl-10 pr-4 bg-gray-100 rounded-md text-base"
                value={searchText}
                onChangeText={setSearchText}
              />
              <View className="absolute top-0 bottom-0 w-auto flex items-center justify-center p-2">
                <Search size={20} color="#9ca3af" />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => setOpen(false)}
              className="h-11 justify-center items-center"
            >
              <Text className="text-base text-primary-300 font-medium">Close</Text>
            </TouchableOpacity>
          </View>

          {/* Options */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            contentContainerStyle={{ paddingVertical: 16 }}
            renderItem={({ item }) => {
              const selected = value === item.value;
              return (
                <TouchableOpacity
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                    setSearchText('');
                  }}
                  className={`flex-row items-center gap-2 px-4 py-4 rounded-md ${
                    selected ? 'bg-gray-100' : ''
                  }`}
                >
                  {selected && <Check size={18} color="#4b5563" />}
                  <Text className="text-base text-gray-800">
                    {item?.label?.toUpperCase() || ''}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View className="px-6 py-8 items-center">
                <Text className="text-gray-400">No results found</Text>
              </View>
            }
          />
        </View>
      </Model>
    </View>
  );
};

export { Select };
