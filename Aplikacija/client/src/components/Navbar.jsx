import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  DarkMode,
  LightMode,
  Menu,
  Close,
  RunCircle
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setLogout, setMode , setGame} from "state/authSlice";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import socket from "Socket/socketInstance";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token= useSelector((state)=>state.token);
  const game= useSelector((state)=>state.game);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const dark = theme.palette.neutral.dark;
  const background = theme.palette.background.default;
  const primaryLight = theme.palette.primary.light;
  const primaryDark= theme.palette.primary.dark;
  const neutralMain= theme.palette.neutral.main;
  


  return (
    <FlexBetween padding="1rem 6%" backgroundColor={neutralLight}>
      <FlexBetween gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color={primaryLight}
          onClick={() => navigate("/home",)}
          sx={{
            "&:hover": {
              color: neutralMain,
              cursor: "pointer",
            },
          }}
        >
          Higher&Lower
        </Typography>
      </FlexBetween>

      {/* DESKTOP NAV */}
      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: dark, fontSize: "25px" }} />
            )}
          </IconButton>
          {token  && (
          <Box>
            {(game?.status=='waiting' || game?.status=='finished') &&(<IconButton onClick={()=>{
              socket.emit('leaveGame', {roomId:game.gameId, token:token});
              socket.off();
              dispatch(setGame({game:null}));
              navigate("/home");
              window.location.reload();
              }} 
              sx={{ marginRight:"30px" }}>
              <RunCircle sx={{ fontSize:"25px" }} />
            </IconButton>)}
            <FormControl variant="standard" value={user.username}>
              <Select
                value={user.username}
                sx={{
                  backgroundColor: primaryLight,
                  width: "150px",
                  borderRadius: "0.25rem",
                  p: "0.25rem 1rem",
                  "& .MuiSvgIcon-root": {
                    pr: "0.25rem",
                    width: "3rem",
                  },
                  "& .MuiSelect-select:focus": {
                    backgroundColor: primaryLight,
                  },
                
                }}
                input={<InputBase />}
              >
                <MenuItem onClick={()=>navigate(`/profile/${user.username}`)}value={user.username}>
                  <Typography>{user.username}</Typography>
                </MenuItem>
                <MenuItem onClick={() => {
                  dispatch(setLogout());
                  navigate("/");
                  }}
                >
                  Log Out
                </MenuItem>
              </Select>
          </FormControl>
          </Box>)}
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          <Menu />
        </IconButton>
      )}

      {/* MOBILE NAV */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={background}
        >
          {/* CLOSE ICON */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton
              onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
            >
              <Close />
            </IconButton>
          </Box>

          {/* MENU ITEMS */}
          <FlexBetween
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="3rem"
          >
            <IconButton
              onClick={() => dispatch(setMode())}
              sx={{ fontSize: "25px" }}
            >
              {theme.palette.mode === "dark" ? (
                <DarkMode sx={{ fontSize: "25px" }} />
              ) : (
                <LightMode sx={{ color: dark, fontSize: "25px" }} />
              )}
            </IconButton>
            
            {token  && (<FormControl variant="standard" value={user.username}>
            <Select
              value={user.username}
              sx={{
                backgroundColor: primaryLight,
                width: "150px",
                borderRadius: "0.25rem",
                p: "0.25rem 1rem",
                "& .MuiSvgIcon-root": {
                  pr: "0.25rem",
                  width: "3rem",
                },
                "& .MuiSelect-select:focus": {
                  backgroundColor: primaryLight,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem onClick={()=>navigate(`/profile/${user.username}`)} value={user.username}>
                <Typography>{user.username}</Typography>
              </MenuItem>
              <MenuItem onClick={() => {
                dispatch(setLogout());
                navigate("/");
                }}
              >
                Log Out
              </MenuItem>
            </Select>
          </FormControl>)}
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;
