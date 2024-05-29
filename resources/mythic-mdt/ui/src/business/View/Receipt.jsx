import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Divider, List, ListItem, ListItemText, Grid, Alert, Button, ButtonGroup } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { toast } from 'react-toastify';
import Moment from 'react-moment';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';

import { Loader, UserContent } from '../../components';
import Nui from '../../util/Nui';
import { usePermissions } from '../../hooks';
const useStyles = makeStyles((theme) => ({
	wrapper: {
		padding: '20px 10px 20px 20px',
		height: '100%',
	},
	notes: {
		color: theme.palette.text.alt,
		padding: '8px 16px',
		whiteSpace: 'pre-line',
		'& img': {
			width: '100%',
			maxWidth: 300,
		},
	},
	link: {
		color: theme.palette.text.alt,
		transition: 'color ease-in 0.15s',
		'&:hover': {
			color: theme.palette.primary.main,
		},
	},
	officerLink: {
		color: theme.palette.text.alt,
		transition: 'color ease-in 0.15s',
		'&:hover': {
			color: theme.palette.primary.main,
		},
		'&:not(:last-of-type)': {
			content: '", "',
			color: theme.palette.text.main,
		},
	},
}));

export default ({ match }) => {
	const classes = useStyles();
	const history = useNavigate();
	const hasPerms = usePermissions();
	const params = useParams();

	const [err, setErr] = useState(false);
	const [loading, setLoading] = useState(false);
	const [report, setReport] = useState(null);

	const onEdit = () => {
		history(`/business/create/receipt/${report._id}`);
	};

	const onDelete = async () => {
		if (hasPerms('TABLET_MANAGE_RECEIPT', false)) {
			try {
				let res = await (
					await Nui.send('BusinessReceiptDelete', {
						id: report._id,
					})
				).json();
				if (res) {
					toast.success('Receipt Deleted');
					history(`/business/search/receipt`);
				} else toast.error('Unable to Delete Receipt');
			} catch (err) {
				console.log(err);
				toast.error('Unable to Delete Receipt');
			}
		}
	};

	const canEditReport = () => {
		return hasPerms('TABLET_MANAGE_RECEIPT', false);
	};

	const fetch = async () => {
		// setReport({
		//   _id: 0,
		//   type: 'Full Repair',
		//   customerName: 'Bob',
		//   customerNumber: 'Ballsack',
		//   paymentAmount: '100',
		//   paymentPaid: '100',
		//   notes: '<p><a title=\"sedfsdf\" href=\"https://google.com\">https://google.com</a></p>',
		//   author: {},
		//   lastUpdated: {
		//     SID: 3,
		//     Callsign: 302,
		//     First: 'Shit',
		//     Last: 'Cunt',
		//     Time: 1628967582 * 1000,
		//   }
		// });
		// return

		setLoading(true);
		try {
			let res = await (
				await Nui.send('BusinessReceiptView', {
					id: params.id,
				})
			).json();

			if (res) setReport(res);
			else toast.error('Unable to Load Receipt');
		} catch (err) {
			console.log(err);
			toast.error('Unable to Load Receipt');
			setErr(true);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetch();
	}, []);

	return (
		<div>
			{loading || (!report && !err) ? (
				<div className={classes.wrapper} style={{ position: 'relative' }}>
					<Loader static text="Loading" />
				</div>
			) : err ? (
				<Grid className={classes.wrapper} container>
					<Grid item xs={12}>
						<Alert variant="outlined" severity="error">
							Invalid Document ID
						</Alert>
					</Grid>
				</Grid>
			) : (
				<>
					<Grid className={classes.wrapper} container spacing={2}>
						<Grid item xs={12}>
							<ButtonGroup fullWidth>
								<Button onClick={fetch} disabled={loading}>
									Refresh
								</Button>
								<Button disabled={!canEditReport} onClick={onEdit}>
									Edit Document
								</Button>
								{hasPerms('TABLET_MANAGE_RECEIPT', false) && <Button onClick={onDelete}>Delete Document</Button>}
							</ButtonGroup>
						</Grid>
						<Grid item xs={12}>
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<ListItemText
										primary={
											<span>
												Created <Moment date={report.time} fromNow />
											</span>
										}
										secondary={
											<span>
												By&nbsp;
												{`${report.author.First} ${report.author.Last} (${report.author.SID})`}
												&nbsp;on&nbsp;
												<Moment date={report.time} format="LLL" />
											</span>
										}
									/>
								</Grid>
								<Grid item xs={6}>
									{report.lastUpdated && (
										<ListItemText
											primary={
												<span>
													Last Updated <Moment date={report.lastUpdated?.Time} fromNow />
												</span>
											}
											secondary={
												<span>
													By&nbsp;
													{`${report.lastUpdated.First} ${report.lastUpdated.Last} (${report.lastUpdated.SID})`}
													&nbsp;on&nbsp;
													<Moment date={report.lastUpdated?.Time} format="LLL" />
												</span>
											}
										/>
									)}
								</Grid>
							</Grid>
							<Divider flexItem />
						</Grid>
						<Grid item xs={6}>
							<List>
								<ListItem>
									<ListItemText 
										primary="Receipt Type"
										secondary={report.type}
									/>
								</ListItem>
								<ListItem>
									<ListItemText 
										primary="Customer Name"
										secondary={report.customerName}
									/>
								</ListItem>
								<ListItem>
									<ListItemText 
										primary="Customer Number"
										secondary={report.customerNumber}
									/>
								</ListItem>
								<ListItem>
									<ListItemText 
										primary="Payment Charge"
										secondary={report.paymentAmount}
									/>
								</ListItem>
								<ListItem>
									<ListItemText 
										primary="Payment Paid"
										secondary={report.paymentPaid}
									/>
								</ListItem>
							</List>
						</Grid>
						<Grid item xs={6}>
							<List>
								<ListItem>
									<ListItemText
										primary={`Additional Employees`}
										secondary={
											(report.workers && report.workers.length > 0) ? (
												<span>
													{report.workers.map((o) => {
														return (
															<span key={`assisting-${o.SID}`}>
																{`${o.First} ${o.Last} (${o.SID})`}
																<br></br>
															</span>
														);
													})}
												</span>
											) : (
												`No Additional Employees`
											)
										}
									/>
								</ListItem>
								<ListItem>
									<ListItemText primary="Additional Notes" />
								</ListItem>
								<div className={classes.notes}>
									<UserContent wrapperClass={classes.notes} content={report.notes} />
								</div>
							</List>
						</Grid>
					</Grid>
				</>
			)}
		</div>
	);
};
