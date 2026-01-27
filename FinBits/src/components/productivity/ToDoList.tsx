import { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  Sparkles,
  Edit,
  Trash2,
  Check,
  Clock,
} from "lucide-react";
import AddTodoListModal from "./AddToDoListModal";
import AddTodoListAIModal from "./AddToDoListAiModal";
import DeleteModalToDoList from "./DeleteModalToDoList";
import EditTodoListModal from "./EditToDoListModal";
import { productivityService } from "../../services/productivityService";
import { AlertModal } from "../common";
import { useAlert } from "../../hooks";
import type { TodoItem } from "../../types/productivity";

interface TodoDisplay extends TodoItem {
  isOpen: boolean;
  isSelected: boolean;
  completedAt?: string;
}

const parseTime = (note?: string) => {
  const m =
    note?.match(/(\d{1,2}:\d{2})\s*[–-]?\s*(\d{1,2}:\d{2})?/) ||
    note?.match(/(\d{1,2}:\d{2})/);
  return m ? m[1] : null;
};

const getResetInfo = (completedAt?: string, note?: string) => {
  if (!completedAt) return { canReset: true, timeRemaining: "" };

  let resetDate = new Date(completedAt);
  resetDate.setDate(resetDate.getDate() + 1);
  resetDate.setHours(0, 0, 0, 0);

  const diff = resetDate.getTime() - Date.now();
  const canReset = diff <= 0;

  const hRem = Math.floor(diff / 36e5);
  const mRem = Math.floor((diff % 36e5) / 6e4);

  return { canReset, timeRemaining: canReset ? "" : `${hRem}j ${mRem}m` };
};

const TodoRow = ({
  todo,
  actionMode,
  onSelect,
  onToggleOpen,
  onStatusUpdate,
  onComplete,
}: any) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const { canReset, timeRemaining } = getResetInfo(todo.completedAt, todo.note);
  const displayTime = parseTime(todo.note);
  const isCompleted = todo.status === "Completed";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return { bg: "bg-red-600", border: "border-red-600" };
      case "In Progress":
        return { bg: "bg-blue-500", border: "border-blue-500" };
      case "Completed":
        return { bg: "bg-green-600", border: "border-green-600" };
      default:
        return { bg: "bg-gray-500", border: "border-gray-500" };
    }
  };

  const statusColor = getStatusColor(todo.status);

  const handleStatusSelect = (status: string) => {
    onStatusUpdate(todo.todo_id, status);
    setShowStatusMenu(false);
  };

  return (
    <div className="relative space-y-2">
      <div
        className={`flex items-center justify-between p-3 bg-[#1e1e1e] border rounded-lg transition-colors ${todo.isSelected
          ? actionMode === "edit"
            ? "border-blue-500 bg-blue-900/10"
            : "border-red-500 bg-red-900/10"
          : "border-gray-700 hover:border-emerald-500/50"
          }`}
      >
        <div className="flex items-center gap-3 flex-1">
          {actionMode !== "none" && (
            <button
              onClick={() => onSelect(todo.todo_id)}
              className={`w-5 h-5 border rounded flex center ${todo.isSelected ? (actionMode === "edit" ? "bg-blue-500" : "bg-red-500") : "border-gray-500"}`}
            >
              {todo.isSelected && <Check className="w-3 text-white" />}
            </button>
          )}

          {actionMode === "none" && (
            <button
              onClick={() => onComplete(todo)}
              disabled={isCompleted && !canReset}
              className={`w-5 h-5 border-2 rounded flex items-center justify-center ${isCompleted ? "bg-emerald-500 border-emerald-500" : "border-gray-500 hover:border-emerald-500"} ${isCompleted && !canReset ? "opacity-50" : ""}`}
            >
              {isCompleted && <Check className="w-3 text-white" />}
            </button>
          )}

          <div
            className="cursor-pointer flex-1 flex items-center gap-3"
            onClick={() => onToggleOpen(todo.todo_id)}
          >
            <span
              className={`text-sm font-medium ${isCompleted ? "text-gray-500 line-through" : ""}`}
            >
              {todo.task_name}
            </span>
            {displayTime && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3" />
                {displayTime}
              </span>
            )}
            {isCompleted && !canReset && (
              <span className="text-xs text-amber-500 bg-amber-900/20 px-2 rounded">
                Reset: {timeRemaining}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {actionMode === "none" && (
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`w-5 h-5 rounded-full border-2 cursor-pointer transition-all hover:scale-110 ${statusColor.bg} ${statusColor.border}`}
                title={`Status: ${todo.status}`}
              />
              {showStatusMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-[#252525] border border-gray-600 rounded-lg shadow-lg z-20">
                  {["Pending", "In Progress", "Completed"].map((s) => {
                    const sColor = getStatusColor(s);
                    return (
                      <button
                        key={s}
                        onClick={() => handleStatusSelect(s)}
                        className={`w-full text-left px-4 py-3 text-xs flex gap-3 items-center transition-colors ${todo.status === s
                          ? "bg-gray-700 text-white"
                          : "hover:bg-gray-800 text-gray-300"
                          }`}
                      >
                        <div className={`w-3 h-3 rounded-full ${sColor.bg}`} />
                        <span className="font-medium">{s === "Pending" ? "Tertunda" : s === "In Progress" ? "Sedang Dikerjakan" : "Selesai"}</span>
                        {todo.status === s && (
                          <Check className="w-3 h-3 ml-auto text-emerald-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          <ChevronDown
            onClick={() => onToggleOpen(todo.todo_id)}
            className={`w-5 cursor-pointer transition-transform ${todo.isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {todo.isOpen && actionMode === "none" && (
        <div className="p-4 bg-[#121212] border border-gray-700 rounded-xl mx-1 text-sm space-y-2 animate-in fade-in">
          <div className="flex justify-between">
            <p>
              <span className="text-gray-400">To Do List:</span> {todo.task_name}
            </p>
            <p
              className={
                todo.status === "Pending" ? "text-red-400" : "text-green-400"
              }
            >
              {todo.status === "Pending" ? "Tertunda" : "Selesai"}
            </p>
          </div>
          <p>
            <span className="text-gray-400">Catatan:</span> {todo.note || "-"}
          </p>
        </div>
      )}
    </div>
  );
};

const TodoApp = () => {
  const [todos, setTodos] = useState<TodoDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [modals, setModals] = useState({
    ai: false,
    regular: false,
    edit: false,
    delete: false,
  });
  const [selectedTodo, setSelectedTodo] = useState<TodoDisplay | null>(null);
  const [actionMode, setActionMode] = useState<"none" | "edit" | "delete">(
    "none",
  );
  const { alert, showSuccess, showError, closeAlert } = useAlert();

  const getTimestamps = () =>
    JSON.parse(localStorage.getItem("todoCompletedTimestamps") || "{}");
  const updateTimestamp = (id: number, time: string | null) => {
    const ts = getTimestamps();
    time ? (ts[id] = time) : delete ts[id];
    localStorage.setItem("todoCompletedTimestamps", JSON.stringify(ts));
  };

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productivityService.getTodos();
      const ts = getTimestamps();
      setTodos(
        (res.data || []).map((t: TodoItem) => ({
          ...t,
          isOpen: false,
          isSelected: false,
          completedAt: t.status === "Completed" ? ts[t.todo_id] : undefined,
        })),
      );
    } catch (err) {
      showError("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
    const interval = setInterval(() => {
      setTodos((currentTodos) => {
        let hasChanges = false;
        const updated = currentTodos.map((t) => {
          if (
            t.status === "Completed" &&
            getResetInfo(t.completedAt, t.note).canReset
          ) {
            hasChanges = true;
            updateTimestamp(t.todo_id, null);
            productivityService.updateTodo(t.todo_id, { status: "Pending" });
            return { ...t, status: "Pending", completedAt: undefined };
          }
          return t;
        });
        return hasChanges ? updated : [...currentTodos];
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchTodos]);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await productivityService.updateTodo(id, { status });
      const ts = status === "Completed" ? new Date().toISOString() : null;
      updateTimestamp(id, ts);
      setTodos((prev) =>
        prev.map((t) =>
          t.todo_id === id ? { ...t, status, completedAt: ts || undefined } : t,
        ),
      );
    } catch {
      showError("Gagal update status");
    }
  };

  const handleComplete = (todo: TodoDisplay) => {
    if (todo.status === "Completed") {
      handleStatusUpdate(todo.todo_id, "Pending");
    } else {
      handleStatusUpdate(todo.todo_id, "Completed");
    }
  };

  const handleSelection = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => ({
        ...t,
        isSelected:
          actionMode === "edit"
            ? t.todo_id === id
              ? !t.isSelected
              : false
            : t.todo_id === id
              ? !t.isSelected
              : t.isSelected,
      })),
    );
  };

  const handleBatchDelete = async () => {
    const selected = todos.filter((t) => t.isSelected);
    try {
      await Promise.all(
        selected.map((t) => productivityService.deleteTodo(t.todo_id)),
      );
      setTodos((prev) => prev.filter((t) => !t.isSelected));
      setModals({ ...modals, delete: false });
      setActionMode("none");
      showSuccess("Berhasil menghapus todo");
    } catch {
      showError("Gagal menghapus");
    }
  };

  const selectedCount = todos.filter((t) => t.isSelected).length;

  if (loading)
    return (
      <div className="text-white p-6 text-center animate-pulse">
        Memuat daftar To Do List...
      </div>
    );

  return (
    <div className="text-white p-6 font-sans">
      {actionMode !== "none" && (
        <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-3">

          <span className="text-[12px] sm:text-sm flex gap-2 items-center font-medium">
            {actionMode === "edit" ? (
              <Edit className="w-4 h-4 text-blue-400" />
            ) : (
              <Trash2 className="w-4 h-4 text-red-400" />
            )}
            <span className="leading-tight">
              {actionMode === "edit"
                ? "Pilih 1 item untuk edit"
                : `${selectedCount} dipilih untuk hapus`}
            </span>
          </span>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            {actionMode === "delete" && (
              <button
                onClick={() => {
                  setTodos((prev) =>
                    prev.map((t) => ({ ...t, isSelected: true }))
                  );
                }}
                className="flex-1 sm:flex-none text-[11px] sm:text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded transition-colors whitespace-nowrap"
              >
                Pilih Semua
              </button>
            )}
            <button
              onClick={() => {
                setActionMode("none");
                setTodos((t) => t.map((x) => ({ ...x, isSelected: false })));
              }}
              className="flex-1 sm:flex-none text-[11px] sm:text-xs px-3 py-1.5 bg-red-900/50 hover:bg-red-800 rounded transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center text-zinc-500 py-8">Belum ada To Do List.</div>
        ) : (
          todos.map((todo) => (
            <TodoRow
              key={todo.todo_id}
              todo={todo}
              actionMode={actionMode}
              onSelect={handleSelection}
              onToggleOpen={(id: number) =>
                setTodos((p) =>
                  p.map((t) =>
                    t.todo_id === id ? { ...t, isOpen: !t.isOpen } : t,
                  ),
                )
              }
              onStatusUpdate={handleStatusUpdate}
              onComplete={handleComplete}
            />
          ))
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-6">
          <button
            onClick={() => setModals({ ...modals, ai: true })}
            disabled={actionMode !== "none"}
            className="btn-base border border-gray-700 py-2.5 px-2 rounded hover:border-emerald-500 flex justify-center gap-2 items-center text-[11px] sm:text-xs md:text-sm font-medium transition-all"
          >
            <span className="truncate">Tambah To Do List AI</span>
            <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
          </button>

          <button
            onClick={() => setModals({ ...modals, regular: true })}
            disabled={actionMode !== "none"}
            className="btn-base border border-gray-700 py-2.5 px-2 rounded hover:border-emerald-500 text-[11px] sm:text-xs md:text-sm font-medium transition-all truncate"
          >
            Tambah To Do List
          </button>

          <button
            onClick={() => {
              setActionMode("edit");
              setTodos((t) => t.map((x) => ({ ...x, isSelected: false })));
            }}
            className="border border-gray-700 py-2.5 px-2 rounded hover:border-blue-500 text-[11px] sm:text-xs md:text-sm font-medium transition-all truncate"
          >
            Edit To Do List
          </button>

          <button
            onClick={() => {
              setActionMode("delete");
              setTodos((t) => t.map((x) => ({ ...x, isSelected: false })));
            }}
            className="border border-gray-700 py-2.5 px-2 rounded hover:border-red-500 text-[11px] sm:text-xs md:text-sm font-medium transition-all truncate"
          >
            Hapus To Do List
          </button>
        </div>
      </div>

      {modals.ai && (
        <AddTodoListAIModal
          onClose={() => setModals({ ...modals, ai: false })}
          onSuccess={() => {
            fetchTodos();
            setModals({ ...modals, ai: false });
          }}
        />
      )}
      {modals.regular && (
        <AddTodoListModal
          onClose={() => setModals({ ...modals, regular: false })}
          onSuccess={() => {
            fetchTodos();
            setModals({ ...modals, regular: false });
          }}
        />
      )}

      {(modals.edit || (actionMode === "edit" && selectedCount > 0)) &&
        (() => {
          const target = selectedTodo || todos.find((t) => t.isSelected);
          return target ? (
            <EditTodoListModal
              todo={target}
              onClose={() => {
                setModals({ ...modals, edit: false });
                setActionMode("none");
              }}
              onSave={() => {
                fetchTodos();
                setActionMode("none");
              }}
            />
          ) : null;
        })()}

      {(modals.delete || (actionMode === "delete" && selectedCount > 0)) && (
        <DeleteModalToDoList
          isOpen={
            modals.delete || (actionMode === "delete" && selectedCount > 0)
          }
          onClose={() => {
            setModals({ ...modals, delete: false });
            setActionMode("none");
            setTodos((t) => t.map((x) => ({ ...x, isSelected: false })));
          }}
          onConfirm={handleBatchDelete}
        />
      )}

      <AlertModal
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
    </div>
  );
};

export default TodoApp;
