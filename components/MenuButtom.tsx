import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet, View, ViewStyle, ImageSourcePropType } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface MenuButtomProps {
    imageSource?: ImageSourcePropType;
    text?: string;
    backgroundColor?: string;
    navigateTo: string;
    navigation: any;
    style?: ViewStyle;
    iconName?: string; // Novo: nome do ícone opcional
    iconColor?: string; // Novo: cor do ícone opcional
    iconSize?: number; // Novo: tamanho do ícone opcional
}

const MenuButtom: React.FC<MenuButtomProps> = ({
    imageSource,
    text,
    backgroundColor = '#2F80ED',
    navigateTo,
    navigation,
    style,
    iconName,
    iconColor = '#fff',
    iconSize = 36
}) => {
    return (
        <TouchableOpacity
            style={[styles.button, imageSource ? undefined : { backgroundColor }, style]}
            onPress={() => {
                // Se o texto for um ano, envie como parâmetro
                const year = Number(text);
                if (!isNaN(year)) {
                    navigation.navigate(navigateTo, { year });
                } else {
                    navigation.navigate(navigateTo);
                }
            }}
            activeOpacity={0.8}
        >
            {iconName ? (
                <MaterialIcons name={iconName} size={iconSize} color={iconColor} />
            ) : imageSource ? (
                <Image source={imageSource} style={styles.image} resizeMode="contain" />
            ) : (
                <Text style={styles.text}>{text}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 60,
        minHeight: 60,
        margin: 8,
    },
    image: {
        width: 40,
        height: 40,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default MenuButtom;
