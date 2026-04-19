#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <netinet/in.h>

int main() {
    int sfd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(sfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(8080);
    bind(sfd, (struct sockaddr*)&addr, sizeof(addr));
    listen(sfd, 10);

    printf("Serving on port 8080\n"); fflush(stdout);

    while (1) {
        int cfd = accept(sfd, NULL, NULL);
        char req[4096] = {0};
        read(cfd, req, sizeof(req) - 1);

        /* Parse path from "GET /foo.html HTTP/1.1" */
        char path[256] = "/index.html";
        sscanf(req, "%*s %255s", path);
        if (strcmp(path, "/") == 0) strcpy(path, "/index.html");

        /* Reject anything with ".." to prevent path traversal */
        char filepath[512];
        if (strstr(path, "..")) {
            const char *r = "HTTP/1.1 403 Forbidden\r\nContent-Length: 9\r\n\r\nForbidden";
            write(cfd, r, strlen(r));
            close(cfd); continue;
        }
        snprintf(filepath, sizeof(filepath), "/workspace/hackbench%s", path);

        FILE *f = fopen(filepath, "r");
        if (!f) {
            const char *r = "HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\n\r\nNot Found";
            write(cfd, r, strlen(r));
        } else {
            fseek(f, 0, SEEK_END); long sz = ftell(f); fseek(f, 0, SEEK_SET);
            char *body = malloc(sz);
            fread(body, 1, sz, f); fclose(f);
            const char *mime = "text/html; charset=utf-8";
            if (strstr(path, ".svg"))  mime = "image/svg+xml";
            else if (strstr(path, ".css")) mime = "text/css";
            else if (strstr(path, ".js"))  mime = "application/javascript";
            char hdr[256];
            snprintf(hdr, sizeof(hdr),
                "HTTP/1.1 200 OK\r\nContent-Type: %s\r\nContent-Length: %ld\r\n\r\n", mime, sz);
            write(cfd, hdr, strlen(hdr));
            write(cfd, body, sz);
            free(body);
        }
        close(cfd);
    }
}
