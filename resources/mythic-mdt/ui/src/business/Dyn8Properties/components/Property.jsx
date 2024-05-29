import React from 'react';
import { ListItem, ListItemText, Grid, ListItemSecondaryAction, IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router';
import { CurrencyFormat } from '../../../util/Parser';

import { usePermissions } from '../../../hooks';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Moment from 'react-moment';
import Nui from '../../../util/Nui';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		padding: '20px 10px 20px 20px',
		borderBottom: `1px solid ${theme.palette.border.divider}`,
		'&:first-of-type': {
			borderTop: `1px solid ${theme.palette.border.divider}`,
		},
	},
}));

import { propertyCategories } from '../data';

export default ({ property, upgradeData, onClick, onSecondaryClick, onViewInfoClick, onTransfer }) => {
	const classes = useStyles();
	const history = useNavigate();
	const hasPermission = usePermissions();

	const onInternalClick = () => {
		if (hasPermission('JOB_SELL', false)) {
			if (property.sold) {
				onTransfer();
			} else {
				onClick();
			}
		}
	};

	let interiorData = null;
	if (property?.upgrades?.interior && upgradeData && upgradeData[property.type]?.interior?.levels) {
		interiorData = upgradeData[property.type].interior.levels.find(int => int.id == property.upgrades.interior);
	}

	const onGPSMark = async () => {
		try {
            let res = await (
                await Nui.send('Dyn8MarkProperty', property._id)
            ).json();

            if (res) {
                toast.success('Marked Successfully');
            } else {
                toast.error('Error Marking GPS');
            };
        } catch (err) {
            console.log(err);
			toast.error('Error Marking GPS');
        }
	};

    const onSecondary = (e) => {
        e.stopPropagation();

		if (hasPermission('JOB_SELL', false)) {
			onSecondaryClick();
		} else {
			toast.error('Invalid Permissions');
		}
    };

	const onCopyId = async (e) => {
        e.stopPropagation();

		try {
            let res = await (
                await Nui.send('Dyn8CopyID', property._id)
            ).json();

            if (res) {
                toast.success('Copied Successfully');
            } else {
                toast.error('Error Copying Property');
            };
        } catch (err) {
            console.log(err);
			toast.error('Error Copying Property');
        }
    };

	const onViewingInfo = () => {
		onViewInfoClick();
	}


	return (
		<ListItem className={classes.wrapper} button onClick={onInternalClick}>
			<Grid container spacing={1}>
                <Grid item xs={2}>
					<ListItemText
						primary={'Type'}
						secondary={`${propertyCategories.find(c => c.value == property?.type)?.label ?? 'Unknown'}`}
					/>
				</Grid>
				<Grid item xs={3}>
					<ListItemText primary={'Property'} secondary={property?.label} />
				</Grid>
                <Grid item xs={2}>
					<ListItemText
						primary={'Price'}
						secondary={`${CurrencyFormat.format(Math.ceil(property?.price))}`}
					/>
				</Grid>
				<Grid item xs={2}>
					<ListItemText
						primary={'Interior'}
						secondary={`${interiorData ? interiorData.name : 'Unknown'}`}
					/>
				</Grid>
				<Grid item xs={3}>
					<ListItemText
						primary="Owner"
						secondary={property?.owner ? `${property?.owner.First} ${property?.owner.Last} (${property?.owner.SID})` : 'Not Owned'}
					/>

				</Grid>
			</Grid>
			<ListItemSecondaryAction>
				<IconButton onClick={onGPSMark}>
					<FontAwesomeIcon
						icon={['fas', 'location-crosshairs']}
					/>
				</IconButton>
				<IconButton onClick={onSecondary}>
					<FontAwesomeIcon
						icon={['fas', 'hammer']}
					/>
				</IconButton>
				<IconButton onClick={onViewingInfo}>
					<FontAwesomeIcon
						icon={['fas', 'circle-info']}
					/>
				</IconButton>
				<IconButton onClick={onCopyId}>
					<FontAwesomeIcon
						icon={['fas', 'copy']}
					/>
				</IconButton>
			</ListItemSecondaryAction>
		</ListItem>
	);
};
