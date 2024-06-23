const Cell = ({details, onUpdateFlag, onRevealCell}) => {
  const cellStyle = {
    width: 40,
    height: 40,
    background: 'lightgrey',
    borderWidth: 3,
    borderStyle: details.revealed===true ? 'inset' : 'outset',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer'
  }

  const getCellDisplay = () => {
    if (!details.revealed) {return details.flagged ? '🚩' : null;}
    if (details.value === 'X') {return '💣';}
    if (details.value === 0) {return null;}
    return details.value;
  }

  return (
    <div style={cellStyle} onContextMenu={(e) => onUpdateFlag(e, details.x, details.y)} onClick={() => onRevealCell(details.x, details.y)}>
      {getCellDisplay()}
    </div>
  );
}

export default Cell;
