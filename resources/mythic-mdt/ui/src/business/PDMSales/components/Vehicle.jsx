import React from 'react';
import { ListItem, ListItemText, Grid, ListItemSecondaryAction, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router';
import { CurrencyFormat } from '../../../util/Parser';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Moment from 'react-moment';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		padding: '20px 10px 20px 20px',
		borderBottom: `1px solid ${theme.palette.border.divider}`,
		'&:first-of-type': {
			borderTop: `1px solid ${theme.palette.border.divider}`,
		},
	},
}));

import { vehicleCategories } from '../data';

export default ({ vehicle, dealerData, onClick }) => {
	const classes = useStyles();
	const history = useNavigate();

	const onInternalClick = () => {
		onClick();
	};

    const onSecondary = (e) => {
        e.stopPropagation();
		console.log(vehicle.vehicle);
    };

	const priceMult = 1 + (dealerData?.profitPercentage / 100);
	const salePrice = vehicle?.data?.price * priceMult;

	return (
		<ListItem className={classes.wrapper} button onClick={onInternalClick}>
			<Grid container spacing={1}>
				<Grid item xs={3}>
					<ListItemText primary={'Vehicle Make/Model'} secondary={`${vehicle?.data?.make} ${vehicle?.data?.model}`} />
				</Grid>
                <Grid item xs={1}>
					<ListItemText
						primary={'Class'}
						secondary={`${vehicle?.data?.class}`}
					/>
				</Grid>
                <Grid item xs={2}>
					<ListItemText
						primary={'Price'}
						secondary={`${CurrencyFormat.format(Math.ceil(salePrice))} (${CurrencyFormat.format(vehicle?.data?.price)})`}
					/>
				</Grid>
				<Grid item xs={2}>
					<ListItemText
						primary={'Quantity'}
						secondary={`${vehicle?.quantity}`}
					/>
				</Grid>
                <Grid item xs={2}>
					<ListItemText
						primary={'Category'}
						secondary={`${vehicleCategories.find(c => c.value == vehicle?.data?.category)?.label ?? 'Unknown'}`}
					/>
				</Grid>
				<Grid item xs={2}>
					<ListItemText
						primary="Last Purchase"
						secondary={vehicle?.lastPurchase ? <Moment unix date={vehicle?.lastPurchase} fromNow /> : 'Never'}
					/>
                    <ListItemSecondaryAction onClick={onSecondary}>
                        <IconButton>
                            <FontAwesomeIcon
                                icon={['fas', 'magnifying-glass']}
                            />
                        </IconButton>
                    </ListItemSecondaryAction>
				</Grid>
			</Grid>
		</ListItem>
	);
};
