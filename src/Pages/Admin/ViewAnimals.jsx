import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import http from "../../http";

function RenderButton(props) {
  const { animal } = props;
  const buttonElement = React.useRef(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    window.location.reload();
  };

  const [openRelease, setOpenRelease] = useState(false);
  const handleOpenRelease = () => {
    setOpenRelease(true);
  };
  const handleCloseRelease = () => {
    setOpenRelease(false);
    navigate("/admin/viewsanctuary")
  };

  return (
    <>
      <Button
        ref={buttonElement}
        variant="contained"
        size="small"
        style={{ backgroundColor: "#008CBA", marginRight: 10 }}
        component={Link}
        to={`/admin/animal-qr/${animal.id}`}
      >
        Animal QR
      </Button>

      {animal.outcome_type === "To be released to sanctuary" && (
        <Button
          ref={buttonElement}
          variant="contained"
          size="small"
          style={{ backgroundColor: "green", marginRight: 10 }}
          onClick={handleOpenRelease}
        >
          To Sanctuary
        </Button>
      )}

      <Dialog open={openRelease} close={handleClose}>
        <DialogTitle>Release Animal to Sanctuary</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to release this animal to the sanctuary?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="inherit"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              http
                .post(
                  `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/sanctuary`, // Replace with your API URL for the release action
                  {
                    animal_ID: animal.id,
                    animal_name: "To be updated",
                    description: "To be updated",
                    donated_amount: 0,
                  }
                )
                .then((res) => {
                  console.log(res.data);
                  handleCloseRelease();
                })
                .catch((err) => {
                  console.error("Error during release: ", err);
                });
              http.put(
                `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD/animals?animal_ID=${animal.id}`,
                {
                  outcome_type: "Released to Sanctuary",
                  case_status: "Closed",
                }
              );
            }}
          >
            Release
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        ref={buttonElement}
        variant="contained"
        size="small"
        style={{ backgroundColor: "#6CA0DC" }}
        LinkComponent={Link}
        to={`/admin/viewanimals/edit/${animal.id}`}
      >
        Edit Animal
      </Button>

      <Button
        variant="contained"
        size="small"
        style={{ marginLeft: 16, backgroundColor: "#C70000" }}
        onClick={handleOpen}
      >
        Delete
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Delete Animal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this Animal?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              http
                .delete(
                  `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD/animals?animal_ID=${animal.id}`
                )
                .then((res) => {
                  console.log(res.data);
                  handleClose();
                });
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ViewAnimals() {
  const btnstyle = {
    margin: "30px 0",
    fontWeight: "bold",
    color: "white",
    backgroundColor: "#FF4E00",
  };
  const [animalList, setAnimalList] = useState([]);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 50,
      renderCell: (params) => (
        <Link
          to={`/admin/viewanimals/profile/${params.value}`}
          style={{ textDecoration: "underline", color: "blue" }}
        >
          {params.value}
        </Link>
      ),
    },
    { field: "species", headerName: "Species", width: 100 },
    {
      field: "current_health_status",
      headerName: "Current Status",
      width: 130,
      renderCell: (params) => {
        const isToBeUpdated = params.value === "To be updated";
        return (
          <span style={{ fontWeight: isToBeUpdated ? "bold" : "normal" }}>
            {params.value}
          </span>
        );
      },
    },
    {
      field: "outcome_type",
      headerName: "Outcome Type",
      width: 210,
      renderCell: (params) => {
        const isToBeUpdated = params.value === "To be updated";
        return (
          <span style={{ fontWeight: isToBeUpdated ? "bold" : "normal" }}>
            {params.value}
          </span>
        );
      },
    },

    {
      field: "case_status",
      headerName: "Case Status",
      width: 110,
      renderCell: (params) => {
        const status = params.value;
        let statusStyle = {};

        if (status === "Open") {
          statusStyle = { color: "red", fontWeight: "bold" };
        } else if (status === "Closed") {
          statusStyle = { color: "#4A4A4A", fontWeight: "bold" };
        }

        return <span style={statusStyle}>{status}</span>;
      },
    },
    {
      field: "action",
      headerName: "Actions",
      width: 420,
      renderCell: (params) => <RenderButton animal={params.row} />,
    },
  ];

  const rows = animalList.map((animal) => ({
    id: animal.animal_ID,
    species: animal.species,
    weight: animal.weight,
    current_health_status: animal.current_health_status,
    outcome_type: animal.outcome_type,
    case_status: animal.case_status,
  }));

  const getAnimals = () => {
    http
      .get(
        `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD`
      )
      .then((res) => {
        console.log("Data: ", res.data);
        setAnimalList(res.data);
      });
  };

  useEffect(() => {
    getAnimals();
  }, []);

  return (
    <>
      <Button
        variant="contained"
        style={btnstyle}
        LinkComponent={Link}
        to={`/admin/addanimal`}
      >
        Add Animal Rescue
      </Button>
      <div style={{ width: "100%", backgroundColor: "white" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ height: 500 }}
        />
      </div>
    </>
  );
}

export default ViewAnimals;
