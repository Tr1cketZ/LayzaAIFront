import React from 'react';
import { Text, View } from 'react-native';

export function renderMarkdownToRN(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, idx) => {
    // Título com linha toda entre ** **
    if (/^\s*\*\*(.+)\*\*\s*$/.test(line)) {
      const title = line.match(/^\s*\*\*(.+)\*\*\s*$/)?.[1] ?? '';
      elements.push(
        <Text key={idx} style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
          {title}
        </Text>
      );
    }
    // Bullet points
    else if (/^\s*[\*\-]\s+/.test(line)) {
      const content = line.replace(/^[\*\-]\s+/, '');
      elements.push(
        <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginLeft: 16 }}>
          <Text style={{ fontSize: 18, marginRight: 6 }}>•</Text>
          <Text style={{ flex: 1 }}>{renderInlineStyles(content)}</Text>
        </View>
      );
    }
    // Linha com texto normal e estilos
    else {
      elements.push(
        <Text key={idx}>{renderInlineStyles(line)}</Text>
      );
    }
  });

  return <View>{elements}</View>;
}

// Renderiza negrito, itálico, sublinhado, tachado e código inline
function renderInlineStyles(text: string): React.ReactNode {
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|~~[^~]+~~|`[^`]+`)/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <Text key={index} style={{ fontWeight: 'bold' }}>{part.slice(2, -2)}</Text>;
    } else if (/^\*[^*]+\*$/.test(part)) {
      return <Text key={index} style={{ fontStyle: 'italic' }}>{part.slice(1, -1)}</Text>;
    } else if (/^__[^_]+__$/.test(part)) {
      return <Text key={index} style={{ textDecorationLine: 'underline' }}>{part.slice(2, -2)}</Text>;
    } else if (/^~~[^~]+~~$/.test(part)) {
      return <Text key={index} style={{ textDecorationLine: 'line-through' }}>{part.slice(2, -2)}</Text>;
    } else if (/^`[^`]+`$/.test(part)) {
      return <Text key={index} style={{ fontFamily: 'monospace', backgroundColor: '#eee', padding: 2 }}>{part.slice(1, -1)}</Text>;
    } else {
      return <Text key={index}>{part}</Text>;
    }
  });
}
