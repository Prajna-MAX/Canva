// Canva.js
import { useEffect, useState } from "react";
import Menu from "./Menu";
import "./Canva.css";

function Canva() {
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [lineColor, setLineColor] = useState("black");
    const [tool, setTool] = useState("pencil");
    const [paths, setPaths] = useState([]);
    const [currentPath, setCurrentPath] = useState(null);
    const [history, setHistory] = useState([]);
    const [redoStack, setRedoStack] = useState([]);
    const [text, setText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [textPos, setTextPos] = useState(null);

    useEffect(() => {
        const canvas = document.getElementById("paintCanvas");
        const ctx = canvas.getContext("2d");
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    useEffect(() => {
        redrawAll();
    }, [paths]);

    const resize = () => {
        const canvas = document.getElementById("paintCanvas");
        const header = document.querySelector("h1");
        const headerHeight = header ? header.offsetHeight : 0;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - headerHeight;
        redrawAll();
    };

    const redrawAll = () => {
        const canvas = document.getElementById("paintCanvas");
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        paths.forEach(path => drawSinglePath(path));
    };

    const drawSinglePath = (path) => {
        const canvas = document.getElementById("paintCanvas");
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.size;
        path.points.forEach((point, index) => {
            if (index === 0) ctx.moveTo(point.x, point.y);
            else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        ctx.closePath();
    };

    const getMousePos = (e) => {
        const canvas = document.getElementById("paintCanvas");
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const startDrawing = (e) => {
        const { x, y } = getMousePos(e);
        if (tool === "smartEraser") {
            for (let i = 0; i < paths.length; i++) {
                for (let point of paths[i].points) {
                    const dx = point.x - x;
                    const dy = point.y - y;
                    if (Math.sqrt(dx * dx + dy * dy) < 15) {
                        const newPaths = [...paths];
                        newPaths.splice(i, 1);
                        setPaths(newPaths);
                        return;
                    }
                }
            }
            return;
        }
        if (tool === "text") {
            setTextPos({ x, y });
            setIsTyping(true);
            return;
        }
        setIsDrawing(true);
        const newPath = {
            color: tool === "eraser" ? "#ffffff" : lineColor,
            size: lineWidth,
            points: [{ x, y }]
        };
        setCurrentPath(newPath);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { x, y } = getMousePos(e);
        setCurrentPath(prev => {
            const updated = { ...prev, points: [...prev.points, { x, y }] };
            redrawAll();
            drawSinglePath(updated);
            return updated;
        });
    };

    const endDrawing = () => {
        if (currentPath) {
            setHistory([...history, paths]);
            setRedoStack([]);
            setPaths([...paths, currentPath]);
            setCurrentPath(null);
        }
        setIsDrawing(false);
    };

    const drawText = (x, y, content) => {
        const canvas = document.getElementById("paintCanvas");
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = lineColor;
        ctx.font = "20px sans-serif";
        ctx.fillText(content, x, y);
    };

    const handleUndo = () => {
        if (history.length === 0) return;
        const lastState = history[history.length - 1];
        setRedoStack([paths, ...redoStack]);
        setPaths(lastState);
        setHistory(history.slice(0, -1));
    };

    const handleRedo = () => {
        if (redoStack.length === 0) return;
        const nextState = redoStack[0];
        setHistory([...history, paths]);
        setPaths(nextState);
        setRedoStack(redoStack.slice(1));
    };

    const handleSave = () => {
        const canvas = document.getElementById("paintCanvas");
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "drawing.png";
        link.click();
    };

    return (
        <div className="App">
            <h1>Paint App</h1>
            <div className="menu-bar">
                <Menu setLineColor={setLineColor} setLineWidth={setLineWidth} />
                <button
  className={tool === "pencil" ? "active-tool" : ""}
  onClick={() => setTool("pencil")}
>
  ✏️ Pencil
</button>

                <button
                 className={`tool-btn ${tool === "eraser" ? "active-tool" : ""}` }
                 onClick={() => setTool("eraser")}>🧽 Eraser</button>
                <button 
                className={`tool-btn ${tool === "smartEraser" ? "active-tool" : ""}`}
                onClick={() => setTool("smartEraser")}>🧠 Smart Eraser</button>
                <button 
                 className={`tool-btn ${tool === "text" ? "active-tool" : ""}`}
                 onClick={() => setTool("text")}>🔤 Text</button>
                <button className={`tool-btn ${tool === "undo" ? "active-tool" : ""}`}
                 onClick={handleUndo}>↩️ Undo</button>
                <button 
                className={`tool-btn ${tool === "redo" ? "active-tool" : ""}`}
                onClick={handleRedo}>↪️ Redo</button>
                <button 
                className={`tool-btn ${tool === "save" ? "active-tool" : ""}`}
                onClick={handleSave}>💾 Save</button>
            </div>

            <div className="draw-area">
                <canvas
                    id="paintCanvas"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                />
                {isTyping && textPos && (
                    <input
                        type="text"
                        value={text}
                        style={{
                            position: "absolute",
                            top: textPos.y,
                            left: textPos.x,
                            fontSize: "20px",
                            border: "1px solid #ccc"
                        }}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                drawText(textPos.x, textPos.y, text);
                                setText("");
                                setIsTyping(false);
                            }
                        }}
                        autoFocus
                    />
                )}
            </div>
        </div>
    );
}

export default Canva;
