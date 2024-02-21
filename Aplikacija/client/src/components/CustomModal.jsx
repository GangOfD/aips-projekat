import React from "react";
import { Box, IconButton, Modal, Typography, useTheme, Button, useMediaQuery } from "@mui/material";
import { Cancel } from "@mui/icons-material";

const CustomModal = ({ open, onClose, title, content, setSections }) => {

  const theme=useTheme();
  const isSmallScreen = useMediaQuery("(min-width: 600px)");
  console.log(content);
  const handleButtonClick = (key) => {
    // Kopiranje trenutnog stanja
    const newSections = { ...content };
    // Ažuriranje stanja za određeni ključ
    newSections[key] = !newSections[key];
    // Postavljanje novog stanja
    setSections(newSections);
  };
    
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-rate"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%', 
          maxWidth: 500, 
          bgcolor: theme.palette.background.default,
          border: '2px solid #000',
          boxShadow: 20,
          p: 4,
          textAlign: "center",
          maxHeight: "80%",
          overflow: "auto"
        }}
      >
        <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
          <IconButton onClick={onClose}>
            <Cancel />
          </IconButton>
        </Box>
        <Typography id="modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        {title=="Free rooms ids" && content.map((room,index)=>(
          <Typography key={index}>
            {room.gameId}
          </Typography>
        )
        )}
        {title=="Tags" && (
        <Box display="grid" gridTemplateColumns="repeat(4, 1fr)" gap="1rem">
          {Object.keys(content).map((key) => (
            <Button
              key={key}
              variant="contained"
              sx={{ maxWidth: '200px', borderRadius: "2.5rem" , background:content[key] ? "#d604c8" : "primary"}}
              onClick={() => handleButtonClick(key)}
            >
              {`#${key}`}
            </Button>
          ))}
        </Box>
      
        )}
      </Box>
    </Modal>
  );
};

export default CustomModal;
