import heapq

def is_walkable(img, x, y):
    return img[y][x] ==255 # white path

def astar(img, start, end):
    h, w = img.shape
    open_set = []
    heapq.heappush(open_set, (0, start))

    came_from = {}
    g = {start: 0}

    def heuristic(a, b):
        return abs(a[0] - b[0]) + abs(a[1] - b[1])

    while open_set:
        _, current = heapq.heappop(open_set)

        if current == end:
            path = []
            while current in came_from:
                path.append(current)
                current = came_from[current]
            path.append(start)
            return path[::-1]

        for dx, dy in [(1,0), (-1,0), (0,1), (0,-1)]:
            nx, ny = current[0] + dx, current[1] + dy
            if 0 <= nx < w and 0 <= ny < h and is_walkable(img, nx, ny):
                temp_g = g[current] + 1
                neighbor = (nx, ny)

                if neighbor not in g or temp_g < g[neighbor]:
                    g[neighbor] = temp_g
                    f = temp_g + heuristic(neighbor, end)
                    heapq.heappush(open_set, (f, neighbor))
                    came_from[neighbor] = current
    return None
