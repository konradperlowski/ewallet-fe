import {
  Box,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@material-ui/core";
import { useState } from "react";
import DatePicker from "../components/account/DatePicker";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import LoopRoundedIcon from "@material-ui/icons/LoopRounded";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import EventIcon from "@material-ui/icons/Event";
import AddCircleOutlineRoundedIcon from "@material-ui/icons/AddCircleOutlineRounded";
import { makeStyles } from "@material-ui/styles";
import AddTransactionDialog from "../components/account/AddTransactionDialog";
import { useAccountList } from "../providers/AccountListProvider";
import TransactionList from "../components/account/TransactionList";
import { useTransactionList } from "../providers/TransactionListProvider";
import Loading from "../components/core/Loading";
import Balance from "../components/account/Balance";
import AddTransferDialog from "../components/account/AddTransferDialog";
import NoAccount from "../components/account/NoAccount";
import AccountChart from "../components/account/AccountChart";

const useStyles = makeStyles((theme) => ({
  incomeButton: {
    color: theme.green,
  },
  outcomeButton: {
    color: theme.red,
  },
  sortButton: {
    color: theme.black,
    backgroundColor: theme.white,
  },
  accountPicker: {
    maxHeight: 50,
    minWidth: 162,
    maxWidth: 162,
    marginLeft: -20,
    marginRight: 20,
    backgroundColor: theme.white,
  },
}));

export default function Account() {
  const [date, setDate] = useState(new Date());
  const [periodOfTime, setPeriodOfTime] = useState("M");
  const [addTransactionOpen, setAddTransactionOpen] = useState(false);
  const [addTransferOpen, setAddTransferOpen] = useState(false);
  const [transactionType, setTransactionType] = useState("INCOME");
  const { accountList, selectedAccount } = useAccountList();
  const { isTransactionLoading } = useTransactionList();
  const [sortBy, setSortBy] = useState("category");
  const classes = useStyles();

  const addTransaction = (transactionType) => {
    setTransactionType(transactionType);
    setAddTransactionOpen(true);
  };

  return (
    <Container maxWidth="sm">
      {!selectedAccount ? (
        <Loading />
      ) : (
        <>
          <Grid container align="center" direction="column" spacing={2}>
            <Grid item>
              <DatePicker
                date={date}
                setDate={setDate}
                periodOfTime={periodOfTime}
                setPeriodOfTime={setPeriodOfTime}
              />
            </Grid>
            {isTransactionLoading ? (
              <Loading />
            ) : accountList.length === 1 ? (
              <NoAccount />
            ) : (
              <>
                <Grid item>
                  <Balance date={date} periodOfTime={periodOfTime} />
                </Grid>
                <Grid item>
                  <AccountChart date={date} periodOfTime={periodOfTime} />
                </Grid>
                <Grid item>
                  <Box mt={1}>
                    <IconButton
                      className={classes.incomeButton}
                      onClick={() => addTransaction("INCOME")}
                    >
                      <AddCircleOutlineRoundedIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      color="inherit"
                      onClick={() => setAddTransferOpen(true)}
                    >
                      <LoopRoundedIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      className={classes.outcomeButton}
                      onClick={() => addTransaction("OUTCOME")}
                    >
                      <RemoveCircleOutlineOutlinedIcon fontSize="large" />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item>
                  <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Typography>Group by {sortBy}&nbsp;</Typography>
                    <IconButton
                      className={classes.sortButton}
                      size="small"
                      onClick={() =>
                        setSortBy(sortBy === "date" ? "category" : "date")
                      }
                    >
                      {sortBy === "date" ? <FolderOpenIcon /> : <EventIcon />}
                    </IconButton>
                  </Box>
                  <TransactionList
                    sortBy={sortBy}
                    date={date}
                    periodOfTime={periodOfTime}
                  />
                </Grid>{" "}
              </>
            )}
          </Grid>

          <AddTransactionDialog
            open={addTransactionOpen}
            setOpen={setAddTransactionOpen}
            transactionType={transactionType}
          />
          <AddTransferDialog
            open={addTransferOpen}
            setOpen={setAddTransferOpen}
          />
        </>
      )}
    </Container>
  );
}
