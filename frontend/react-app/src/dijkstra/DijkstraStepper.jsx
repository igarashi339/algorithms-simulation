import { Box, Button, LinearProgress, makeStyles, Typography } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

const useStyles = makeStyles(() => ({
  progress: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  line: {
    width: '100%'
  },
  typo: {
    display: 'flex',
    justifyContent: 'center'
  },
  root: {
    width: '100%'
  }
}))

export const DijkstraStepper = ({ currentStep, length, setCurrentStep }) => {
  const classes = useStyles();

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.progress}>
        <Button size="small" onClick={handleBack} disabled={currentStep === 0}>
          <KeyboardArrowLeft />
        </Button>
        <Box className={classes.line}>
          <LinearProgress variant="determinate" value={currentStep / (length - 1) * 100} />
        </Box>
        <Button size="small" onClick={handleNext} disabled={currentStep === length - 1}>
          <KeyboardArrowRight />
        </Button>
      </Box>
      <Typography
        className={classes.typo}
        variant="body2"
        color="textSecondary"
      >
        {`${currentStep + 1} / ${length}`}
      </Typography>
    </Box>
  )
}