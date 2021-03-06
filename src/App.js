import React, {useState, useEffect} from 'react';
import makeData from './makeData';
import Table from './Table';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
// import withWidth from '@material-ui/core/withWidth';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// import './App.css';
import columns from './TableData';


function App(props) {
  
  // useMediaquery as to standardize code
  const theme = useTheme();
  const WidthMatches = useMediaQuery(theme.breakpoints.up('sm'));
  // gets data from makeData Function like api call
  let data = React.useMemo(() => makeData(100), [])

  // creates a searchable text and added it into a data fetched from makeData function
  const createSearchableText = (data) => {
    return(
      data.map(each => { 
        // console.log(each, 'each');
        const searchableKeys = Object.keys(each);
        // In searchableKeys you will get the keys of dictionary
        // console.log(searchableKeys, 'searchableKeys');
        const SeachableText =searchableKeys.map(key => each[key]).join(";")
        // in SeachableText you will get the combined string of all tabledata's
        return(
          {...each, 
            SeachableText: SeachableText
          }
        )
      }
      )
    )
  }

  // called my createSearchableText here and memoized dependent is data when data is changed it will call agian
  let DataWithSearchableText = React.useMemo(() => createSearchableText(data), [data]) ;
  console.log(DataWithSearchableText, 'newww');

  // state for seach box
  const [search, setSearch] = useState('')

  // onChange Handler for searchBox
  const  handleFilterChange = e => {
    const value = e.target.value || undefined;
    setSearch(value);
  };


  // here it will search in data which have searchableText also and it will return data after searching
		if (search) {
		  DataWithSearchableText = DataWithSearchableText.filter(row => {
        // console.log(row, 'rrrr')
				return (
          row.SeachableText.includes(search.toString().toLowerCase())
			)})
    }
    
  // table columns showing methods on basis of screenSize

  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }


  function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
    );
  
    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
  
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
  
    return windowDimensions;
  }

  const { height, width } = useWindowDimensions();

  // sets data in priprity order
  function GetData() {
    const l = [];
    for (let i = 1; i <= columns.length; i += 1) {
      for (const j of columns) {
        if (i === j.priority) {
          l.push(j);
          break;
        }
      }
    }
    // console.log(l,'list haiin')
    return l;
    
  }

  // priorotizedColumns is the data which forwarded to cards so it can show on prority order
  const priorotizedColumns =GetData();

  // get the data od columns that I need  to show
  function name() {
    const finallist = [];
    let calculation = 0;
    const SizeOfTable=width-32;
    // console.log(screenSize, 'size of window');
    // console.log(SizeOfTable, 'size f table');
    for (const i of GetData()) {
      if (calculation + i.minWidth < SizeOfTable) {
        finallist.push(i);
      }
      calculation += i.minWidth;
    }
    if (finallist.length === 0) {
      finallist.push(GetData()[0]);
    }
    // console.log(finallist, 'finallist');
    return finallist;
  }

  // this is the final Dat of columns and it is memoized and invoked when the screenSize is changing by useWindowDimensions
  const finalData =React.useMemo(() => name(), [useWindowDimensions]);
  

  // console.log(screenSize,'screen');



  return (
    <>
    <AppBar position='static'><Toolbar></Toolbar></AppBar>
    <Container xs={12}  style={{marginTop:20}}>
      <Paper elevation={3}>
      <Grid container>
          <Grid item xs={8}>
              <h1 style={{marginLeft:15}}>React-Table</h1>
          </Grid>
          <Grid item xs={2}>
          
            <TextField
                    defaultValue={search}
                    onChange={handleFilterChange}
                    placeholder={"Search"}
                    style={{marginTop:20}}
                    
                  />
          
          </Grid>

      </Grid>
      {
        WidthMatches ?
        <Table columns={finalData} data={DataWithSearchableText} WidthMatches={WidthMatches}/>
        : <Table columns={columns} data={DataWithSearchableText} WidthMatches={WidthMatches}/>
      }
      
      </Paper>
    </Container>
    </>
  )
}

export default App;

