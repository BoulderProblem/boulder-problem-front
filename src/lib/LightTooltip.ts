import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';

// On crée un composant fonctionnel typé avant de le styler
const CustomTooltip = (props: TooltipProps) => {
  return <Tooltip {...props} />;
};

const LightTooltip = styled(CustomTooltip)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
}));

export default LightTooltip;
