// components/FullScreenSelect.tsx

import React, { useEffect, useState } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
    SafeAreaView,
} from "react-native"
import { Search, Check } from "lucide-react-native"

interface FullScreenSelectProps {
    options: string[]
    value: string | null
    onChange: (value: string) => void
    label?: string
    error?: string | null
    placeholder?: string
}

const Select: React.FC<FullScreenSelectProps> = ({
    options,
    value,
    onChange,
    label,
    error,
    placeholder = "Select an option",
}) => {
    const [open, setOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [filtered, setFiltered] = useState<string[]>(options)

    useEffect(() => {
        if (searchText.trim() === "") {
            setFiltered(options)
        } else {
            const lower = searchText.toLowerCase()
            setFiltered(options.filter((opt) => opt.toLowerCase().includes(lower)))
        }
    }, [searchText, options])

    return (
        <View className="w-full">
            {label && (
                <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
            )}

            <TouchableOpacity
                onPress={() => setOpen(true)}
                className={`h-[50] px-5 py-2 border rounded-md flex-row items-center justify-between bg-white ${error ? "border-red-500" : "border-gray-300"
                    }`}
            >
                <Text
                    className={`text-[15px] ${value ? "text-gray-900" : "text-gray-400"
                        }`}
                >
                    {value || placeholder}
                </Text>
            </TouchableOpacity>

            {error && (
                <Text className="text-xs text-red-500 mt-1">{error}</Text>
            )}

            <Modal visible={open} animationType="slide" onRequestClose={()=>setOpen(false)}>
                <SafeAreaView className="flex-1 bg-white">
                    {/* Search bar + Close */}
                    <View className="flex-row items-center justify-center px-4 py-3 border-b border-gray-200 gap-3">
                        <View className="relative flex-1">
                            <TextInput
                                placeholder="Search..."
                                className="h-11 pl-10 pr-4 bg-gray-100 rounded-md text-base"
                                value={searchText}
                                onChangeText={setSearchText}
                            />
                            <View className="absolute top-0 bottom-0 w-auto flex items-center justify-center p-2">
                                <Search
                                    size={20}
                                    color="#9ca3af"
                                />
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => setOpen(false)} className="h-11 justify-center items-center">
                            <Text className="text-base text-blue-600 font-medium">
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Options */}
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item}
                        contentContainerStyle={{ paddingVertical: 16 }}
                        renderItem={({ item }) => {
                            const selected = value === item
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        onChange(item)
                                        setOpen(false)
                                        setSearchText("")
                                    }}
                                    className={`flex-row items-center gap-2 px-6 py-4 ${selected ? "bg-gray-100" : ""
                                        }`}
                                >
                                    {selected && (
                                        <Check size={18} color="#4b5563" />
                                    )}
                                    <Text className="text-base text-gray-800">{item}</Text>
                                </TouchableOpacity>
                            )
                        }}
                        ListEmptyComponent={
                            <View className="px-6 py-8 items-center">
                                <Text className="text-gray-400">No results found</Text>
                            </View>
                        }
                    />
                </SafeAreaView>
            </Modal>
        </View>
    )
}

export { Select }
