import React, {useEffect, useState} from "react";
import ReactApexChart from "react-apexcharts";
// import {series} from "./data";
import colors from "../../assets/theme-dark/base/colors";

import styles from "./Dashboard.module.css";
import fetchReservations from "../../services/reservationService.js";


const Dashboard = () => {

    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const chartOptions = {
        chart: {
            type: 'rangeBar',
            height: 350,
            toolbar: {
                show: false,
            },
            events: {
                dataPointSelection: function (event, chartContext, {seriesIndex, dataPointIndex, w}) {
                    const data = w.config.series[seriesIndex].data[dataPointIndex];
                    const reservationCode = data.code;
                    const url = `https://localhost:5173/reservations/${reservationCode}`;
                    window.open(url, '_blank'); // Opens the URL in a new tab
                }
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
        xaxis: {
            type: 'datetime',
            min: today.getTime(), // Start from today
            max: thirtyDaysFromNow.getTime(),
            labels: {
                style: {
                    colors: colors.text.main,
                },
                formatter: function (val) {
                    const date = new Date(val);
                    const day = String(date.getDate()).padStart(2, '0'); // Ensures 2 digits
                    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensures 2 digits, months are 0-indexed
                    return `${day}/${month}`;
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    colors: colors.text.main,
                },

            },
        },
        dataLabels: {
            enabled: false,
        },
        colors: colors.primary.main,
        // [theme.palette.primary.main],
        tooltip: {
            theme: 'dark',
            x: {
                format: 'dd/MM',
            },
            custom: function ({series, seriesIndex, dataPointIndex, w}) {
                const data = w.config.series[seriesIndex].data[dataPointIndex];
                const start = new Date(data.y[0]).toLocaleDateString();
                const end = new Date(data.y[1]).toLocaleDateString();
                const code = data.code;
                return `<div style="padding:5px;">
                        <strong>Reservation Code:</strong> ${code}<br/>
                        <strong>From:</strong> ${start}<br/>
                        <strong>To:</strong> ${end}
                    </div>`;
            }
        },
        title: {
            text: 'Reservation Schedule',
            align: 'center',
            style: {
                color: colors.text.main,
                fontSize: '20px',
                fontWeight: 900,
            },
        },
    };

    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        let isMounted = true;

        const loadReservations = async () => {
            try {
                const data = await fetchReservations();
                if (isMounted) {
                    const transformedSeries = transformReservationsToSeries(data);
                    setReservations(transformedSeries);
                    setLoading(false);
                }

            } catch (error) {
                if (!isMounted) {
                    console.error("Error loading reservations:", error);
                    setError(error.message);
                    setLoading(false);
                }
            }
        };

        loadReservations();

        return () => {
            isMounted = false;
        };
    }, []);

    const transformReservationsToSeries = (reservations) => {
        const series = [];

        reservations.forEach((reservation) => {
            Object.keys(reservation.rooms).forEach((roomId) => {
                const roomName = reservation.rooms[roomId];
                const checkIn = new Date(reservation.check_in).getTime();
                const checkOut = new Date(reservation.check_out).getTime();
                const reservationCode = reservation.reservation_code || 'N/A';

                series.push({
                    x: roomName,
                    y: [checkIn, checkOut],
                    code: reservationCode,
                });
            })
        })

        return [{name:'Rooms', data: series}];

    };

    if (error) {
        return <div className={styles.chartDiv} style={{backgroundColor: colors.background.cardTransparent}}>
            <p style={{textAlign: "center", fontSize: "1.5rem"}}>{error}</p>
        </div>;
    }


    return (
        <div className={styles.chartDiv} style={{backgroundColor: colors.background.cardTransparent}}>
            <ReactApexChart options={chartOptions} series={reservations} type="rangeBar" height={350}/>
        </div>
    );
};

export default Dashboard;