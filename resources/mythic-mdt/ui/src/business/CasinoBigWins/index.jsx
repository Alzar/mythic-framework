import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	Grid,
	TextField,
	InputAdornment,
	IconButton,
	Pagination,
	List,
	Button,
	MenuItem,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { throttle } from 'lodash';
import qs from 'qs';
import { useNavigate, useLocation } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { usePermissions, useGovJob } from '../../hooks';

import Nui from '../../util/Nui';
import { Loader } from '../../components';

import Item from './components/Win';
import { gameCatagories } from './data';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
	wrapper: {
		padding: '20px 10px 20px 20px',
		height: '100%',
	},
	search: {
		//height: '10%',
	},
	results: {
		//height: '',
	},
	noResults: {
		margin: '15% 0',
		textAlign: 'center',
		fontSize: 22,
		color: theme.palette.text.main,
	},
	items: {
		maxHeight: '95%',
		height: '95%',
		overflowY: 'auto',
		overflowX: 'hidden',
	},
	searchButton: {
		height: '90%',
		// marginBottom: 10,
	},
}));

const escapeRegex = (string) => {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export default () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const hasPermission = usePermissions();
	const hasJob = useGovJob();
	const history = useNavigate();
	const location = useLocation();
	const type = 'casino-bigwins';
	const PER_PAGE = 6;

	const searchTerm = useSelector((state) => state.search.searchTerms[type]);
	let qry = qs.parse(location.search.slice(1));

	const [pages, setPages] = useState(1);
	const [page, setPage] = useState(qry.page ? +qry.page : 1);
	const [loading, setLoading] = useState(false);
	const [err, setErr] = useState(false);
	const [results, setResults] = useState(Array());
    const [filtered, setFiltered] = useState(Array());
    const [cat, setCat] = useState('all');

    useEffect(() => {
        if (results) {
			const escapedSearchTerm = escapeRegex(searchTerm ?? '');
            setFiltered(results
                .filter(s => cat == 'all' || cat == s?.Type)
                .filter(s => new RegExp(escapedSearchTerm, 'i').test(`${s?.Winner?.First} ${s?.Winner?.Last}`)
                || new RegExp(escapedSearchTerm, 'i').test(s?.Prize))
            );

			setPage(1);
        } else {
            setFiltered(Array())
        };
    }, [results, cat, searchTerm]);

	useEffect(() => {
		setPages(Math.ceil(filtered?.length / PER_PAGE));
	}, [filtered]);

    const fetch = useMemo(() => throttle(async (value) => {
		setLoading(true);
        setPage(1);

        try {
            let res = await (
                await Nui.send('CasinoGetBigWins', {})
            ).json();

            if (res) {
                setResults(res);
            } else throw res;
            setLoading(false);
        } catch (err) {
            console.log(err);
            setErr(true);

            setLoading(false);
        }
	}, 3000), []);

	useEffect(() => {
		fetch();
	}, []);

	const onSearch = (e) => {
		e.preventDefault();
	};

	const onSearchChange = (e) => {
		dispatch({
			type: 'UPDATE_SEARCH_TERM',
			payload: {
				type: type,
				term: e.target.value,
			},
		});
	};

	const onClear = () => {
		dispatch({
			type: 'CLEAR_SEARCH',
			payload: { type },
		});

		setResults(Array());
	};

	const onPagi = (e, p) => {
		setPage(p);
	};

	const onRefresh = () => {
		fetch();
	};

    const sellVehicle = (vehicle) => {
        setSelling(vehicle);
    };

	return (
		<div className={classes.wrapper}>
			<div className={classes.search}>
				<form onSubmitCapture={onSearch}>
					<Grid container spacing={1}>
                        <Grid item xs={3}>
                            <TextField
                                select
                                fullWidth
                                label="Category"
                                name="type"
                                className={classes.editorField}
                                value={cat}
                                onChange={(e) => setCat(e.target.value)}
                            >
                                {gameCatagories.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
						<Grid item xs={7}>
							<TextField
								fullWidth
								variant="outlined"
								name="search"
								value={searchTerm}
								onChange={onSearchChange}
								error={err}
								helperText={err ? 'Error Performing Search' : null}
								label="Search"
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											{searchTerm != '' && (
												<IconButton
													type="button"
													onClick={onClear}
												>
													<FontAwesomeIcon
														icon={['fas', 'xmark']}
													/>
												</IconButton>
											)}
											<IconButton
												type="submit"
												disabled={loading}
											>
												<FontAwesomeIcon
													icon={['fas', 'magnifying-glass']}
												/>
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</Grid>
						<Grid item xs={2}>
							<Button
								variant="outlined"
								fullWidth
								style={{ height: '100%' }}
								onClick={onRefresh}
							>
								Refresh
							</Button>
						</Grid>
					</Grid>
				</form>
			</div>
			<div className={classes.results}>
				{loading ? (
					<Loader text="Loading" />
				) : filtered?.length > 0 ? (
					<>
						<List className={classes.items}>
							{filtered
                                .sort((a, b) => b.time - a.time)
								.slice((page - 1) * PER_PAGE, page * PER_PAGE)
								.map((result) => {
									return (
										<Item
											key={result._id}
											win={result}
										/>
									);
								})}
						</List>
						{pages > 1 && (
							<Pagination
								variant="outlined"
								shape="rounded"
								color="primary"
								page={page}
								count={pages}
								onChange={onPagi}
							/>
						)}
					</>
				) : <p className={classes.noResults}>No Results Found</p>}
			</div>
		</div>
	);
};
