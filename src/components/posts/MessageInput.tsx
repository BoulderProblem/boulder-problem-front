import React, { useEffect, useRef, useState } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import SendIcon from '@mui/icons-material/Send';
interface MessageInputProps {
  onSend: (message: string) => void;
  parseEmojis?: (text: string) => string;
}
const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const pickerRefEmoji = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pickerRefEmoji.current &&
        !pickerRefEmoji.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }
    if (showPicker) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPicker]);
  const emojiMap: Record<string, string> = {
    ':)': '😊',
    ':-)': '😊',
    ';)': '😉',
    ':-D': '😃',
    ':D': '😃',
    ':(': '🙁',
  };
  function parseEmojis(text: string): string {
    let parsed = text;
    for (const [key, emoji] of Object.entries(emojiMap)) {
      const regex = new RegExp(
        key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'),
        'g'
      );
      parsed = parsed.replace(regex, emoji);
    }
    return parsed;
  }
  const handleSend = () => {
    if (!newMessage.trim()) return;
    onSend(newMessage.trim());
    setNewMessage('');
  };
  return (
    <Box
      p={2}
      borderTop={1}
      borderColor="divider"
      display="flex"
      alignItems="center"
      position="relative"
    >
      {' '}
      <IconButton
        onClick={(e) => {
          e.stopPropagation();
          setShowPicker((prev) => !prev);
        }}
        className="w-9 h-9"
      >
        {' '}
        <span style={{ fontSize: '1.5rem' }}>😀</span>{' '}
      </IconButton>{' '}
      {showPicker && (
        <Box
          ref={pickerRefEmoji}
          position="fixed"
          bottom="60px"
          left="10px"
          zIndex={10}
        >
          {' '}
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) =>
              setNewMessage((prev) => prev + emoji.native)
            }
          />{' '}
        </Box>
      )}{' '}
      <TextField
        variant="outlined"
        size="small"
        fullWidth
        multiline
        value={newMessage}
        onChange={(e) =>
          setNewMessage(
            parseEmojis ? parseEmojis(e.target.value) : e.target.value
          )
        }
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            handleSend();
          } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const newValue = newMessage + '\n';
            setNewMessage(newValue);
          }
        }}
        placeholder="Écrire un message..."
        sx={{ mx: 1, '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
      />{' '}
      <IconButton onClick={handleSend} disabled={!newMessage.trim()}>
        {' '}
        <SendIcon />{' '}
      </IconButton>{' '}
    </Box>
  );
};
export default MessageInput;
