# entity_matching_tool
Tool for cozy manual datasets matching

# Build and Start
```
npm install
npm run build
pip3 install -r requirements.txt
python3 main.py
```
or 

```
./start.sh
```

# Dockerfile for PostgreSQL

```
FROM postgres:9.6
MAINTAINER Aleksey Pauls <aleksey.pauls@mail.ru>
USER postgres
RUN /etc/init.d/postgresql start
EXPOSE 5432
RUN mkdir -p /var/run/postgresql && chown -R postgres /var/run/postgresql
VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]
```
