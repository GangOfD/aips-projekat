import React from "react";
import { Box, IconButton, Modal, Typography, useTheme, } from "@mui/material";
import { Cancel } from "@mui/icons-material";

const CustomModal = ({ open, onClose, title, content }) => {

    const theme=useTheme();
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
          width: 400,
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
        {content}
      </Box>
    </Modal>
  );
};

export default CustomModal;
