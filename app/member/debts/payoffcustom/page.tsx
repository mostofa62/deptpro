"use client";
import {
  getPageNumbers,
  PerPageList,
} from "@/app/components/grid/useFetchGridData";
import useAuth from "@/app/hooks/useAuth";
import DefaultLayout from "@/app/layout/DefaultLayout";
import {
  Cell,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  Row,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import HolderOne from "@/app/layout/HolderOne";

import axios from "axios";
import { DataLabel } from "../cu/DataValidationSchema";
const url = process.env.NEXT_PUBLIC_API_URL;

import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragEndEvent,
  closestCenter,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

import { SortableContext, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import IconDragVertical from "@/app/images/icon/drag-vertical";
import GridPaginationHolder from "@/app/components/grid/GridPaginationHolder";
import { useMediaQuery } from "react-responsive";
import DashGrid from "@/app/images/icon/dash-grid";
import toast from "react-hot-toast";

const per_page_list = PerPageList();
const per_page = per_page_list[0];
// const per_page = 3;

interface DataRow {
  id: number;
  name: string;
  debt_type: string;
  balance: number;
  monthly_payment: number;
  monthly_interest: number;
  custom_payoff_order: number;
}

const SortableCardFull: React.FC<{
  row: DataRow;
  activeId: number | null;
  overId: number | null;
}> = ({ row, activeId, overId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.id });

  const style = {
    transform: CSS.Transform.toString(transform)
      ? `${CSS.Transform.toString(transform)} scale(${isDragging ? 1.05 : 1})`
      : undefined,
    transition: isDragging
      ? "transform 0.15s ease-out"
      : "transform 0.25s cubic-bezier(0.25, 1, 0.5, 1)",
    zIndex: isDragging ? 50 : row.id === overId ? 25 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`rounded-2xl border bg-white p-4 cursor-grab active:cursor-grabbing
        transition-all duration-300 ease-out
        ${
          isDragging
            ? "shadow-2xl scale-[1.03] rotate-[1deg]"
            : "shadow-md hover:shadow-lg hover:scale-[1.01]"
        }
        ${row.id === activeId ? "bg-blue-500 text-white" : ""}
        ${row.id === overId ? "bg-blue-50" : ""}
      `}
    >
      <div className="flex flex-col gap-2 select-none">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-lg">{row.name}</div>
          <span className="text-sm text-gray-500 capitalize">
            {row.debt_type}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
          <div>
            <span className="font-medium">Balance:</span>{" "}
            <span>${row.balance.toFixed(2)}</span>
          </div>
          <div>
            <span className="font-medium">Payment:</span>{" "}
            <span>${row.monthly_payment.toFixed(2)}</span>
          </div>
          <div>
            <span className="font-medium">Interest:</span>{" "}
            <span>${row.monthly_interest.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => console.log("Move Up")}
            className="text-xs px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            ↑ Move Up
          </button>
          <button
            onClick={() => console.log("Move Down")}
            className="text-xs px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            ↓ Move Down
          </button>
        </div>
      </div>
    </div>
  );
};

const Debt = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const isTab = useMediaQuery({ maxWidth: 900 });

  const authCtx = useAuth();
  const userid = authCtx.userId;
  const [tableData, setTableData] = useState<DataRow[]>([]);

  const [totalPages, setTotalPages] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const [activeId, setActiveId] = useState<number | null>(null);
  const [overId, setOverId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: per_page,
  });

  const moveRow = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= tableData.length) return;

    const newData = arrayMove(tableData, fromIndex, toIndex);

    // Get source and destination rows in new position
    const sourceRow = newData[toIndex]; // Moved row
    const destinationRow = newData[fromIndex]; // Swapped-with row

    // Swap their custom_payoff_order
    [sourceRow.custom_payoff_order, destinationRow.custom_payoff_order] = [
      destinationRow.custom_payoff_order,
      sourceRow.custom_payoff_order,
    ];

    setTableData(newData);

    const rowsToUpdate = [
      {
        id: sourceRow.id,
        custom_payoff_order: sourceRow.custom_payoff_order,
        name: sourceRow.name,
      },
      {
        id: destinationRow.id,
        custom_payoff_order: destinationRow.custom_payoff_order,
        name: destinationRow.name,
      },
    ];

    axios
      .post(`${url}update-payoff-orderpg`, rowsToUpdate)
      .then((res) => {
        console.log(res.data.message);
        toast.success(res.data.message);
      })
      .catch((err) => console.error("Error updating payoff order:", err));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${url}debtpayoffpg/${userid}`, {
        pageIndex: pagination ? pagination.pageIndex : 0,
        pageSize: pagination ? pagination.pageSize : 0,
      });
      //setData(response.data.rows);
      setTableData(response.data.rows);
      if (typeof response.data.totalRows != "undefined" && setTotalPages) {
        setTotalPages(response.data.totalRows);
      }
      if (typeof response.data.pageCount != "undefined" && setPageCount) {
        setPageCount(response.data.pageCount);
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong!");
    }
    setLoading(false);
  }, [pagination, userid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: ColumnDef<DataRow>[] = [
    /*
    {
      id: "drag", // Unique identifier for the drag column
      header: "", // No header label
      cell: ({ row }) => <IconDragVertical width={20} height={20} />,
    },
    */

    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const index = tableData.findIndex((r) => r.id === row.original.id);

        return (
          <div className="flex gap-2">
            <button
              onClick={() => moveRow(index, index - 1)}
              disabled={index === 0}
              className="text-sm text-[#43acd6] font-bold disabled:opacity-50"
            >
              <svg
                width={15}
                height={15}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
                />
              </svg>
            </button>
            <button
              onClick={() => moveRow(index, index + 1)}
              disabled={index === tableData.length - 1}
              className="text-sm text-[#43acd6] font-bold disabled:opacity-50"
            >
              <svg
                width={15}
                height={15}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={3}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
                />
              </svg>
            </button>
          </div>
        );
      },
    },

    /*{ accessorKey: "custom_payoff_order", header: "Order" },*/
    { accessorKey: "name", header: "Name" },
    { accessorKey: "debt_type", header: "Debt Type" },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: (info) => (
        <p>
          <span>$</span>
          <span>
            {Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(info.getValue<number>())}
          </span>
        </p>
      ),
    },
    {
      accessorKey: "monthly_payment",
      header: "Monthly Payment",
      cell: (info) => (
        <p>
          <span>$</span>
          <span>
            {Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(info.getValue<number>())}
          </span>
        </p>
      ),
    },
    {
      accessorKey: "monthly_interest",
      header: "Monthly Interest",
      cell: (info) => (
        <p>
          <span>$</span>
          <span>
            {Intl.NumberFormat("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(info.getValue<number>())}
          </span>
        </p>
      ),
    },
    // Add more column definitions as needed
  ];

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      //pagination,
      columnVisibility: {
        drag: !(isMobile || isTab), // Hide 'drag' column on mobile/tablet
      },
    },
    getCoreRowModel: getCoreRowModel(),
    //onPaginationChange: setPagination,
    //getPaginationRowModel: getPaginationRowModel(),
    //manualPagination: true,
    //pageCount:pageCount
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }), // Slight movement before dragging
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }) // Allow touch dragging
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tableData.findIndex((row) => row.id === active.id);
      const newIndex = tableData.findIndex((row) => row.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTableData = arrayMove(tableData, oldIndex, newIndex);

        // Swap `custom_payoff_order` between the two rows
        const sourceRow = newTableData[oldIndex];
        const destinationRow = newTableData[newIndex];
        [sourceRow.custom_payoff_order, destinationRow.custom_payoff_order] = [
          destinationRow.custom_payoff_order,
          sourceRow.custom_payoff_order,
        ];

        setTableData(newTableData);

        // Send the updated rows to the backend
        const rowsToUpdate = [
          {
            id: sourceRow.id,
            custom_payoff_order: sourceRow.custom_payoff_order,
            name: sourceRow.name,
          },
          {
            id: destinationRow.id,
            custom_payoff_order: destinationRow.custom_payoff_order,
            name: destinationRow.name,
          },
        ];
        axios
          .post(`${url}update-payoff-orderpg`, rowsToUpdate)
          .then((response) => {
            //console.log(response.data.message);
            toast.success(response.data.message);
          })
          .catch((error) => {
            console.error("Error updating payoff order:", error);
          });

        //handleDragEnd(event);
        setActiveId(null);
        setOverId(null);
      }
    }
  };

  const rows = table.getRowModel().rows;

  return (
    <DefaultLayout>
      <div className="flex flex-col">
        <HolderOne
          title="custom payoff strategy"
          linkItems={[
            {
              link: "/member/debts",
              title: "your debt dashboard",
              icon: <DashGrid width={16} height={16} />,
            },
          ]}
        />

        <div className="mt-10 p-2 flex flex-col gap-5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={(event) => setActiveId(Number(event.active.id))}
            onDragOver={(event) => setOverId(Number(event.over?.id))}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={tableData.map((row) => row.id)}>
              {loading ? (
                <div className="text-center py-10 text-gray-500">
                  Loading...
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
              ) : tableData.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  No data found!
                </div>
              ) : (
                <div
                  className={`
          grid gap-4 p-2
          ${isMobile ? "grid-cols-1" : isTab ? "grid-cols-2" : "grid-cols-3"}
        `}
                >
                  {tableData.map((row) => (
                    <SortableCardFull
                      key={row.id}
                      row={row}
                      activeId={activeId}
                      overId={overId}
                    />
                  ))}
                </div>
              )}
            </SortableContext>
          </DndContext>
        </div>

        {/* {!loading && !error && pageCount * per_page > per_page && (
          <div className="mt-[100px]">
            <GridPaginationHolder
              table={table}
              pageNumbers={pageNumbers}
              handlePageChange={handlePageChange}
            />
          </div>
        )} */}
      </div>
    </DefaultLayout>
  );
};

// SortableRow component for draggable rows
const SortableRow: React.FC<{
  row: Row<DataRow>;
  getVisibleCells: () => Cell<DataRow, unknown>[];
  activeId: number | null;
  overId: number | null;
}> = ({ row, getVisibleCells, activeId, overId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.original.id });

  const isActiveDragging = row.original.id === activeId;
  const isSwapping = row.original.id === overId;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: isActiveDragging
      ? "#43acd6"
      : isSwapping
      ? "#c3f0ca"
      : "white",
    color: isActiveDragging ? "#ffffff !important" : "black",
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {getVisibleCells().map((cell: Cell<DataRow, unknown>) => (
        <td key={cell.id}>
          {typeof cell.column.columnDef.cell === "function"
            ? cell.column.columnDef.cell(cell.getContext())
            : cell.getValue()}
        </td>
      ))}
    </tr>
  );
};

const SortableDiv: React.FC<{
  row: Row<DataRow>;
  getVisibleCells: () => Cell<DataRow, unknown>[];
}> = ({ row, getVisibleCells }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: row.original.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className="flex flex-col border p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
      ref={setNodeRef}
      style={style}
    >
      {/* Drag Handle with Normal Icon */}
      <div className="flex justify-end items-center">
        {/* <span className="font-bold">Row {row.id}</span> */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* <span className="text-lg">≡</span> Normal Unicode icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            width={20}
            height={20}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z"
            />
          </svg>
        </button>
      </div>

      {/* Table Cells */}
      {getVisibleCells().map((cell: Cell<DataRow, unknown>) => (
        <div key={cell.id} className="flex flex-col gap-1">
          <div className="font-semibold">{cell.column.columnDef.header}</div>
          {typeof cell.column.columnDef.cell === "function"
            ? cell.column.columnDef.cell(cell.getContext())
            : cell.getValue()}
        </div>
      ))}
    </div>
  );
};

export default Debt;
