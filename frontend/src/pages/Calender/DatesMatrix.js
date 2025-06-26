import './calendar.css';

const DatesMatrix = ({ dates, currentDay, selectedDay, onSelect }) => {
    return (
        <div className="flex2">
            {dates.map((week, weekIdx) => (
                <div key={`week-${weekIdx}`} className="flexi" style={{ alignContent: 'center' }}>
                    {week.map((day, dayIdx) => (
                        day ? (
                            <div
                                key={`day-${day}-week-${weekIdx}`}
                                style={{
                                    alignContent: 'center',
                                    width: '5vw',
                                    height: '5vh',
                                    borderBottom: selectedDay === day ? '4px solid rgba(255, 0, 0, 0.5)' : 'none',
                                    borderRadius: selectedDay === day ? 'none' : '2vh',
                                    padding: '1vh',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: day === currentDay ? 'rgba(255, 0, 0, 0.5)' : 'inherit'
                                }}
                                onClick={() => onSelect(day)}
                            >
                                {day}
                            </div>
                        ) : (
                            <div key={`empty-${dayIdx}-week-${weekIdx}`} style={{ width: '5vw', height: '5vh' }} />
                        )
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DatesMatrix;