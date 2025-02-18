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
    window.location.reload();
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

      <Button
        ref={buttonElement}
        variant="contained"
        size="small"
        style={{ backgroundColor: "#6CA0DC" }}
        LinkComponent={Link}
        to={`/admin/viewsanctuary/edit/${animal.sanctuary_id}`}
      >
        Edit Details
      </Button>

      <Button
        variant="contained"
        size="small"
        style={{ marginLeft: 16, backgroundColor: "#C70000" }}
        onClick={handleOpen}
      >
        Remove
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Remove Animal</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this Animal?
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
              http.put(
                `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/animal_CRUD/animals?animal_ID=${animal.id}`,
                {
                  outcome_type: "Removed From Sanctuary",
                }
              );
              http
                .delete(
                  `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/sanctuary/id?id=${animal.sanctuary_id}`,
                  {
                    outcome_type: "Removed From Sanctuary",
                  }
                )
                .then((res) => {
                  console.log(res.data);
                  handleClose();
                });
            }}
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ViewAnimalsInSanctuary() {
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
    {
      field: "animal_name",
      headerName: "Name",
      width: 150,
      renderCell: (params) => (
        <strong
          style={{
            fontWeight: params.value === "To be updated" ? "bold" : "normal",
          }}
        >
          {params.value}
        </strong>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 210,
      renderCell: (params) => (
        <div
          style={{
            fontWeight: params.value === "To be updated" ? "bold" : "normal",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%", // Ensure the container takes full available width
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "donated_amount",
      headerName: "Sponsor Amount (SGD)",
      width: 200,
    },
    {
      field: "action",
      headerName: "Actions",
      width: 420,
      renderCell: (params) => <RenderButton animal={params.row} />,
    },
  ];

  const rows = animalList.map((animal) => ({
    sanctuary_id: animal.id,
    id: animal.animal_ID,
    animal_name: animal.animal_name,
    description: animal.description,
    donated_amount: animal.donated_amount,
  }));

  const getAnimals = () => {
    http
      .get(
        `https://i1mu51yxbd.execute-api.us-east-1.amazonaws.com/dev/sanctuary`
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

export default ViewAnimalsInSanctuary;
